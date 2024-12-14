<?php

namespace App\Services\Store;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Models\OrderDetail;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            ->when($request->filled('order_status'), function ($query) use ($request) {
                $query->where('status', $request->order_status);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $searchTerm = $request->search;
                return $query->where(function ($q) use ($searchTerm) {
                    $q->whereAny(['order_number', 'first_name', 'last_name', 'email', 'phone'], 'LIKE', "%{$searchTerm}%");
                });
            })
            ->latest()
            ->with(['orderDetails', 'customer'])
            ->paginate(20);

        return $orders;
    }
}
