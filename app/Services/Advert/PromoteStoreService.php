<?php

namespace App\Services\Advert;

use App\Models\AdvertListing;
use App\Models\AdvertPromotePlan;
use App\Models\Payment;
use App\Enums\PaymentStatusEnum;
use App\Enums\CurrencyType;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentType;
use App\Models\Store;
use App\Models\StorePromotePlan;
use App\Models\StorePromotePlanStore;
use App\Models\User;
use App\Services\Media\MediaService;
use App\Services\PaymentGateways\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PromoteStoreService
{



    public function __construct(protected MediaService $mediaService, private readonly PaymentService $paymentService)
    {
        //
    }


    /**
     * Create a new advert listing with promotion plan
     */
    public function create(array $attributes, string $return_url = null, string $cancel_url = null): array
    {

        return DB::transaction(function () use ($attributes, $return_url, $cancel_url) {

            $listing = $this->createListing($attributes);
            // return $listing->toArray();
            $url = $this->handlePromotion($listing, $attributes['store_promote_plan_id'], $attributes['currency'] ?? CurrencyType::USD, $return_url, $cancel_url);

            return [
                'listing' => $listing->load(['promotePlans']),
                'url' => $url
            ];
        });
    }

    /**
     * Create the base listing
     */
    private function createListing(array $attributes): StorePromotePlanStore
    {
        return StorePromotePlanStore::create($attributes);
    }

    /**
     * Handle the promotion plan assignment and payment if necessary
     */
    private function handlePromotion(StorePromotePlanStore $listing, int $promotePlanId, string $currency, string $return_url = null, string $cancel_url = null)
    {
        $promotePlan = StorePromotePlan::findOrFail($promotePlanId);

        if ($promotePlan->price > 0) {
            return $this->handlePaidPromotion($listing, $promotePlan, $currency, $return_url, $cancel_url);
        }
    }

    /**
     * Handle paid promotion plans
     */
    private function handlePaidPromotion(StorePromotePlanStore $listing, StorePromotePlan $promotePlan, string $currency, string $return_url = null, string $cancel_url = null)
    {

        $listing = StorePromotePlanStore::where('store_id', $listing->store_id)->first();

        $listing->order_number = Str::uuid()->toString();
        $listing->status = OrderStatusEnum::PENDING_PAYMENT;
        $listing->update();

        $init_payment = $this->createPayment($listing, $promotePlan, $currency, $return_url, $cancel_url);
        return $init_payment;
    }



    /**
     * Creates a payment order link for a given advert listing and promotion plan.
     *
     */
    private function createPayment(StorePromotePlanStore $listing, StorePromotePlan $promotePlan, string $currency, string $return_url = null, string $cancel_url = null)
    {
        $orderNumber = $listing->promotePlans()
            ->wherePivot('store_promote_plan_id', $promotePlan->id)
            ->value('order_number');

        if ($currency !== CurrencyType::NGN->value) {
            $paymentData = [
                'currency_code' => $currency,
                'total_amount' => $promotePlan->price,
                'order_number' => $orderNumber,
                'type' => PaymentType::PROMOTION->value,
                'return_url' => $return_url,
                'cancel_url' => $cancel_url,
            ];

            $res = $this->paymentService->gateway('paypal')->initialize($paymentData);
            return $res;
        } else {
            $paymentData = [
                'email' => auth()->user()->email,
                'currency_code' => $currency,
                'total_amount' => $promotePlan->price,
                'order_number' => $orderNumber,
                'type' => PaymentType::PROMOTION->value,
                'return_url' => $return_url,
                'cancel_url' => $cancel_url,
            ];
            $res = $this->paymentService->gateway('paystack')->initialize($paymentData);
            return $res;
        }
    }


    /**
     * Update the promotion status after successful payment
     */
    public function activatePromotion(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $listing = $payment->payable;
            $promotePlan = $listing->promotePlans()->wherePivot('payment_id', $payment->id)->first();

            $listing->promotePlans()->updateExistingPivot($promotePlan->id, [
                'status' => PaymentStatusEnum::SUCCESS->value,
                'started_at' => now(),
                'expires_at' => now()->addDays($promotePlan->duration_days),
            ]);
        });
    }

    /**
     * Cancel a promotion
     */
    public function cancelPromotion(AdvertListing $listing, AdvertPromotePlan $promotePlan): void
    {
        $listing->promotePlans()->updateExistingPivot($promotePlan->id, [
            'status' => PaymentStatusEnum::CANCELED->value,
            'expires_at' => now(),
        ]);
    }

    /**
     * Check and update expired promotions
     */
    public function checkExpiredPromotions(): void
    {
        DB::table('advert_listing_promote_plans')
            ->where('status', PaymentStatusEnum::SUCCESS->value)
            ->where('expires_at', '<=', now())
            ->update(['status' => 'expired']);
    }


    /**
     * Get advert promotion plans based on the provided currency.
     */
    public function getAdvertPlans($currency)
    {
        return AdvertPromotePlan::where('currency', $currency)->get();
    }


    /**
     * Retrieve the user's adverts based on the provided request filters.
     */
    public function getUserAdverts(Request $request)
    {
        $ads = $request->user()->advertListings()
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->whereHas('promotePlans', function ($q) use ($request) {
                    $q->where('status', $request->status);
                });
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->when($request->filled('type'), function ($query) use ($request) {
                $query->where('type', $request->type);
            })

            ->when($request->filled('price_min'), function ($query) use ($request) {
                $query->where('price', '>=', $request->price_min);
            })
            ->when($request->filled('price_max'), function ($query) use ($request) {
                $query->where('price', '<=', $request->price_max);
            })
            ->when($request->filled('state'), function ($query) use ($request) {
                $query->where('state', 'like', '%' . $request->state . '%');
            })

            ->when($request->filled('created_after'), function ($query) use ($request) {
                $query->whereDate('created_at', '>=', $request->created_after);
            })
            ->when($request->filled('created_before'), function ($query) use ($request) {
                $query->whereDate('created_at', '<=', $request->created_before);
            })

            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                        ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->filled('sort'), function ($query) use ($request) {
                $sortField = in_array($request->sort, ['created_at', 'price']) ? $request->sort : 'created_at';
                $sortDirection = $request->filled('order') && $request->order === 'asc' ? 'asc' : 'desc';
                $query->orderBy($sortField, $sortDirection);
            }, function ($query) {
                $query->latest();
            });


        $perPage = $request->input('per_page', 15);
        $ads = $ads->paginate($perPage)->withQueryString();

        return [
            'data' => $ads->items(),
            'pagination' => [
                'current_page' => $ads->currentPage(),
                'per_page' => $ads->perPage(),
                'total' => $ads->total(),
                'last_page' => $ads->lastPage()
            ]
        ];
    }

    /**
     * Retrieve all adverts based on the provided request filters.
     */
    public function getAllAdverts(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|array',
            'category_id.*' => 'integer|exists:categories,id',
        ]);

        $query = AdvertListing::with(['media', 'category', 'payment', 'promotePlans']);

        $query->when($request->filled('status'), function ($query) use ($request) {
            $query->whereHas('promotePlans', function ($q) use ($request) {
                $q->where('status', $request->status);
            });
        });

        if ($request->filled('category_id')) {
            $categoryIds = $validated['category_id'];

            $query->where(function ($q) use ($categoryIds) {
                foreach ($categoryIds as $categoryId) {
                    $q->orWhere('category_id', $categoryId);
                }
            });
        }

        $query->when($request->filled('type'), fn($query) => $query->where('type', $request->type))
            ->when($request->filled('price_min'), fn($query) => $query->where('price', '>=', $request->price_min))
            ->when($request->filled('price_max'), fn($query) => $query->where('price', '<=', $request->price_max))
            ->when($request->filled('state'), fn($query) => $query->where('state', 'like', '%' . $request->state . '%'))
            ->when($request->filled('created_after'), fn($query) => $query->whereDate('created_at', '>=', $request->created_after))
            ->when($request->filled('created_before'), fn($query) => $query->whereDate('created_at', '<=', $request->created_before))
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                        ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->filled('sort'), function ($query) use ($request) {
                $sortField = in_array($request->sort, ['created_at', 'price']) ? $request->sort : 'created_at';
                $sortDirection = $request->filled('order') && $request->order === 'asc' ? 'asc' : 'desc';
                $query->orderBy($sortField, $sortDirection);
            }, function ($query) {
                $query->latest();
            })
            ->when($request->hasHeader('currency'), function ($query) use ($request) {
                $currency = $request->header('currency');
                $query->where('currency', $currency);
            });

        $perPage = $request->input('per_page', 15);
        $ads = $query->paginate($perPage)->appends($request->query());

        return [
            'data' => $ads->items(),
            'pagination' => [
                'current_page' => $ads->currentPage(),
                'per_page' => $ads->perPage(),
                'total' => $ads->total(),
                'last_page' => $ads->lastPage()
            ]
        ];
    }
}
