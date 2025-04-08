<?php

namespace App\Services\Store;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Jobs\RecordCategoryInteractions;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Store;
use App\Notifications\Order\OrderDeliveredNotification;
use App\Notifications\Order\OrderShippedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreService
{

    /**
     * Retrieves a paginated list of store listings for a given user store.
     * Applies various filters and sorting options based on the request parameters,
     * including search, availability, draft status, date, and price.
     *
     * @param \Illuminate\Http\Request $request The HTTP request containing filter and sort parameters.
     * @param \App\Models\Store $userStore The store model instance representing the user's store.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator The paginated list of filtered and sorted listings.
     */
    public function getUserStoreListings(Request $request, Store $userStore)
    {
        $query = $userStore->listings()
            ->when($request->filled('search'), function ($q) use ($request) {
                $searchTerm = '%' . $request->search . '%';
                return $q->where(function ($query) use ($searchTerm) {
                    $query->where('name', 'like', $searchTerm)
                        ->orWhere('description', 'like', $searchTerm)
                        ->orWhere('slug', 'like', $searchTerm);
                });
            })
            ->when($request->filled('availability'), function ($q) use ($request) {
                return $q->availability($request->availability);
            })
            ->when($request->filled('is_draft'), function ($q) use ($request) {
                return $q->isDraft($request->is_draft);
            })
            ->when($request->filled('sort_date'), function ($q) use ($request) {
                return match ($request->sort_date) {
                    'oldest' => $q->oldest(),
                    'newest' => $q->latest(),
                    default => $q->latest()
                };
            })
            ->when($request->filled('sort_price'), function ($q) use ($request) {
                return match ($request->sort_price) {
                    'lowest'  => $q->orderBy('display_price', 'asc'),
                    'highest' => $q->orderBy('display_price', 'desc'),
                    default   => $q
                };
            })
            ->with('ratings');

        return $query->paginate();
    }

    /**
     * Get all  listings
     */
    public function getAllListings(Request $request)
    {
        $currency = $request->header('currency', 'USD');
        $listings = Listing::query()
            ->with(['store', 'ratings'])
            ->byIsDraft(false)
            ->byListingType($request->listingType)
            ->when($request->filled('search'), fn($query) => $query->search($request->search))
            ->when($request->filled('category_ids'), fn($query) => $query->whereIn('category_id', $request->category_ids))
            ->when($request->filled('availability'), fn($query) => $query->availability($request->availability))
            ->when($request->filled('country_id'), fn($query) => $query->byCountry($request->country_id))
            ->byCurrency($currency)
            ->latest()
            ->get();

        RecordCategoryInteractions::dispatch($request->search, $request->header('interactUid'));
        return $listings;
    }

    /**
     * Retrieves a paginated list of orders for a specific store.
     * Filters orders by type, status, and optional search criteria.
     * Orders are sorted by creation date in descending order.
     *
     * @param \Illuminate\Http\Request $request The HTTP request containing filter parameters.
     * @param \App\Models\Store $store The store model instance for which to retrieve orders.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator The paginated list of filtered orders.
     */
    public function getAllStoreOrders(Request $request, Store $store)
    {
        $orders = $store->orders()
            ->where('type', ListingType::PRODUCT->value)
            ->whereNotIn('status', [OrderStatusEnum::PENDING->value, 'incart'])
            ->when($request->filled('order_status'), fn($query) => $query->where('status', $request->order_status))
            ->when($request->filled('search'), function ($query) use ($request) {
                $searchTerm = $request->search;
                return $query->where(function ($q) use ($searchTerm) {
                    $q->whereAny(['order_number', 'first_name', 'last_name', 'email', 'phone'], 'LIKE', "%{$searchTerm}%");
                });
            })
            ->latest()
            ->with(['orderDetails', 'customer', 'shippingMethod'])
            ->paginate(20);

        return $orders;
    }

    /**
     * Retrieves the best deal (lowest priced listing) for each category.
     * Filters active and published listings, optionally filtered by currency.
     * Returns an array of category listings with the lowest price first.
     *
     * @param string|null $currency Optional currency code to filter listings
     * @return \Illuminate\Support\Collection Collection of category listings with best deals
     */
    public function getBestDealsByCategory(?string $currency = null): Collection
    {
        $categories = Category::with([
            'listings' => function ($query) use ($currency) {
                $query->availability(true)
                    ->isDraft(false)
                    ->byType(ListingType::PRODUCT->value)
                    ->when($currency, fn($query) => $query->byCurrency($currency))
                    ->orderByRaw('COALESCE(discounted_price, display_price) ASC')
                    ->limit(1);
            },
            'listings.store'
        ])->get();

        return $categories->map(function ($category) {
            if ($category->listings->isNotEmpty()) {
                return [
                    'listing' => $category->listings->first()
                ];
            }
            return null;
        })->filter()->values();
    }

    /**
     * Get today's deals - prioritizing discounted items or random products as fallback
     *
     * @param string|null $currency
     * @param int $limit Number of deals to return
     * @return Collection
     */
    public function getTodaysDeals(?string $currency = null, int $limit = 10): Collection
    {
        $baseQuery = Listing::where('is_available', true)
            ->with(['store'])
            ->isDraft(false)
            ->byType(ListingType::PRODUCT->value)
            ->when($currency, fn($query) => $query->byCurrency($currency));

        $discountedDeals = (clone $baseQuery)
            ->where('discount', '>', 0)
            ->whereNotNull('discounted_price')
            ->inRandomOrder()
            ->limit($limit)
            ->get();

        if ($discountedDeals->count() >= $limit) {
            return $discountedDeals;
        }

        $remainingItems = $limit - $discountedDeals->count();

        $randomDeals = $baseQuery
            ->whereNotIn('id', $discountedDeals->pluck('id'))
            ->inRandomOrder()
            ->limit($remainingItems)
            ->get();

        return $discountedDeals->concat($randomDeals);
    }


    /**
     * update store order status
     */
    public function updateOrderStatus(Order $order, string $status)
    {
        DB::transaction(function () use ($order, $status) {
            if ($status === OrderStatusEnum::DELIVERED->value) {
                if (!$order->isShippingDurationElapsed()) {
                    throw ValidationException::withMessages([
                        'status' => ['Cannot mark as delivered before shipping duration has elapsed.']
                    ]);
                }
            }

            $order->update(['status' => $status]);

            if ($order->wasChanged() && $status === OrderStatusEnum::SHIPPED->value) {
                $order->update(['shipped_at' => now()]);
                $order->customer->notify(new OrderShippedNotification($order));
            }

            if ($order->wasChanged() && $status === OrderStatusEnum::DELIVERED->value) {
                $order->customer->notify(new OrderDeliveredNotification($order));
            }
        });
    }
}
