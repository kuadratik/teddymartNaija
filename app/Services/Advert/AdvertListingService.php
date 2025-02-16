<?php

namespace App\Services\Advert;

use App\Models\AdvertListing;
use App\Models\AdvertPromotePlan;
use App\Models\Payment;
use App\Enums\PaymentStatusEnum;
use App\Enums\CurrencyType;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentType;
use App\Enums\WishlistType;
use App\Models\User;
use App\Services\Media\MediaService;
use App\Services\PaymentGateways\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdvertListingService
{
    public function __construct(
        protected MediaService $mediaService,
        private readonly PaymentService $paymentService
    ) {
        //
    }

    /**
     * Create a new advert listing with promotion plan
     * @return array
     */
    public function create(array $attributes, string $return_url = null, string $cancel_url = null)
    {

        return DB::transaction(function () use ($attributes, $return_url, $cancel_url) {
            $mediaPaths = $attributes['media'] ?? [];
            unset($attributes['media']);
            $listing = $this->createListing($attributes);

            if (!empty($mediaPaths)) {
                $this->mediaService->storeMedia($listing->id, $mediaPaths);
            }

            $url = $this->handlePromotion($listing, $attributes['promote_plan_id'], $attributes['currency'] ?? CurrencyType::USD, $return_url, $cancel_url);

            return [
                'listing' => $listing->load(['promotePlans', 'media']),
                'url' => $url
            ];
        });
    }

    /**
     * update advert listing with promotion plan
     * @return array
     */
    public function update(AdvertListing $listing, array $attributes, string $return_url = null, string $cancel_url = null)
    {
        if ($listing->getActivePromotePlanStatusAttribute() && $listing->promotePlans()->first()->price > 0) {
            abort(422, 'Advert listing already active');
        }

        return DB::transaction(function () use ($listing, $attributes, $return_url, $cancel_url) {
            $mediaPaths = $attributes['media'] ?? [];
            unset($attributes['media']);
            $listing->update($attributes);
            if (!empty($mediaPaths)) {
                $this->mediaService->storeMedia($listing->id, $mediaPaths);
            }


            if (isset($attributes['promote_plan_id'])) {
                $url =  $this->updatePromotion($listing, $attributes['promote_plan_id'], $attributes['currency'] ?? CurrencyType::USD, $return_url, $cancel_url);
                return [
                    'listing' => $listing->load(['promotePlans', 'media']),
                    'url' => @$url
                ];
            }

            return [
                'listing' => $listing->load(['promotePlans', 'media']),

            ];
        });
    }

    /**
     * Create the base listing
     */
    private function createListing(array $attributes): AdvertListing
    {
        return  AdvertListing::create($attributes);
    }

    /**
     * Handle the promotion plan assignment and payment if necessary
     */
    private function handlePromotion(AdvertListing $listing, int $promotePlanId, string $currency, string $return_url = null, string $cancel_url = null)
    {
        $promotePlan = AdvertPromotePlan::findOrFail($promotePlanId);

        if ($promotePlan->price > 0) {
            return $this->handlePaidPromotion($listing, $promotePlan, $currency, $return_url, $cancel_url);
        } else {
            return $this->handleFreePromotion($listing, $promotePlan);
        }
    }

    /**
     * Handle paid promotion plans
     */
    private function handlePaidPromotion(AdvertListing $listing, AdvertPromotePlan $promotePlan, string $currency, string $return_url = null, string $cancel_url = null)
    {
        $listing->promotePlans()->attach($promotePlan->id, [
            'status' => OrderStatusEnum::PENDING_PAYMENT,
            'order_number'  => Str::uuid()->toString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $init_payment = $this->createPayment($listing, $promotePlan, $currency, $return_url, $cancel_url);
        return $init_payment;
    }

    /**
     * Update the promotion plan for an existing listing.
     */
    private function updatePromotion(AdvertListing $listing, int $promotePlanId, string $currency, string $return_url = null, string $cancel_url = null)
    {
        $promotePlan = AdvertPromotePlan::findOrFail($promotePlanId);

        $listing->promotePlans()->detach();

        if ($promotePlan->price > 0) {
            return $this->handlePaidPromotion($listing, $promotePlan, $currency, $return_url, $cancel_url);
        } else {
            return $this->handleFreePromotion($listing, $promotePlan);
        }
    }

    /**
     * Handle free promotion plans
     */
    private function handleFreePromotion(AdvertListing $listing, AdvertPromotePlan $promotePlan): void
    {
        $startedAt = now();

        $expiresAt = $promotePlan->duration_days > 0
            ? $startedAt->copy()->addDays($promotePlan->duration_days)
            : null;

        $listing->promotePlans()->attach($promotePlan->id, [
            'status' => OrderStatusEnum::ACTIVE,
            'order_number'  => Str::uuid()->toString(),
            'started_at' => $startedAt,
            'expires_at' => $expiresAt,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Creates a payment order link for a given advert listing and promotion plan.
     *
     */
    private function createPayment(AdvertListing $listing, AdvertPromotePlan $promotePlan, string $currency, string $return_url = null, string $cancel_url = null)
    {
        $orderNumber = $listing->promotePlans()
            ->wherePivot('advert_promote_plan_id', $promotePlan->id)
            ->value('order_number');

        if ($currency !== CurrencyType::NGN->value) {
            $paymentData = [
                'currency_code' => $currency,
                'total_amount' => $promotePlan->price,
                'order_number' => $orderNumber,
                'type' => PaymentType::ADVERT->value,
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
                'type' => PaymentType::ADVERT->value,
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
                $query->with(['media', 'category', 'payment', 'promotePlans'])->latest();
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
     *
     * This method fetches adverts with optional filtering by category, status, type, price range,
     * search term, and currency. It also supports pagination.
     *
     * @param Request $request The HTTP request containing filter parameters.
     * @return array An array containing the filtered adverts and pagination details.
     */
    public function getAllAdverts(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|array',
            'category_id.*' => 'integer|exists:categories,id',
        ]);

        $query = AdvertListing::with(['media', 'category', 'payment', 'promotePlans']);

        $query->leftJoin('advert_listing_promote_plans', 'advert_listings.id', '=', 'advert_listing_promote_plans.advert_listing_id')
            ->leftJoin('advert_promote_plans', 'advert_listing_promote_plans.advert_promote_plan_id', '=', 'advert_promote_plans.id')
            ->select('advert_listings.*')
            ->addSelect(DB::raw('MIN(advert_promote_plans.price) as min_promote_plan_price'))
            ->groupBy('advert_listings.id')
            ->orderBy('min_promote_plan_price', 'desc');

        $query->when($request->filled('status'), function ($query) use ($request) {
            $query->whereHas('promotePlans', function ($q) use ($request) {
                $q->where('advert_listing_promote_plans.status', $request->status);
            });
        });

        if ($request->filled('category_id')) {
            $categoryIds = $validated['category_id'];
            $query->where(function ($q) use ($categoryIds) {
                foreach ($categoryIds as $categoryId) {
                    $q->orWhere('advert_listings.category_id', $categoryId);
                }
            });
        }

        $query->when($request->filled('type'), fn($query) => $query->where('advert_listings.type', $request->type))
            ->when($request->filled('price_min'), fn($query) => $query->where('advert_promote_plans.price', '>=', $request->price_min))
            ->when($request->filled('price_max'), fn($query) => $query->where('advert_promote_plans.price', '<=', $request->price_max))
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('advert_listings.title', 'like', '%' . $request->search . '%')
                        ->orWhere('advert_listings.description', 'like', '%' . $request->search . '%');
                });
            })

            ->when($request->hasHeader('currency'), function ($query) use ($request) {
                $currency = $request->header('currency');
                $query->where('advert_listings.currency', $currency);
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


    /**
     * Adds an advert to the user's wishlist.
     *
     * This method checks if the advert is already in the user's wishlist.
     * If it is, the operation is aborted with a 422 status code.
     * Otherwise, the advert is attached to the user's wishlist.
     */
    public function addAdvertToWishlist(AdvertListing $advert, User $user)
    {
        abort_if($user->hasAdvertWishlisted($advert), 422, 'The advert is already in your wishlist.');

        return $user->advertWishlists()->attach($advert->id);
    }


    /**
     * Retrieves the user's advert wishlist.
     *
     * This method fetches the user's advert wishlist and includes the store details for each advert.
     */
    public function getUserAdvertWishlist(User $user)
    {
        return $user->advertWishlists()->with('user.store')->get();
    }

    /**
     * Removes an advert from the user's wishlist.
     *
     * This method checks if the advert is in the user's wishlist.
     * If it is, the advert is detached from the user's wishlist.
     * Otherwise, the operation is aborted with a 422 status code.
     */
    public function removeAdvertFromWishlist(AdvertListing $advert, User $user)
    {
        abort_if(!$user->hasAdvertWishlisted($advert), 422, 'The advert is not in your wishlist.');

        return $user->advertWishlists()->detach($advert->id);
    }
}
