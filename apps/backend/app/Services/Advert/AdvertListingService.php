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
use App\Models\AdvertRating;
use App\Models\User;
use App\Services\Media\MediaService;
use App\Services\PaymentGateways\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Advert\GetAdvertGalleryRequest;

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
    public function create(array $attributes, ?string $return_url = null, ?string $cancel_url = null)
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
    public function update(AdvertListing $listing, array $attributes, ?string $return_url = null, ?string $cancel_url = null)
    {
        return DB::transaction(function () use ($listing, $attributes, $return_url, $cancel_url) {
            $mediaPaths = $attributes['media'] ?? [];
            unset($attributes['media']);
            $listing->update($attributes);
            if (!empty($mediaPaths)) {
                $this->mediaService->updateMedia($listing->id, $mediaPaths);
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
    private function handlePromotion(AdvertListing $listing, int $promotePlanId, string $currency, ?string $return_url = null, ?string $cancel_url = null)
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
    private function handlePaidPromotion(AdvertListing $listing, AdvertPromotePlan $promotePlan, string $currency, ?string $return_url = null, ?string $cancel_url = null)
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
    private function updatePromotion(AdvertListing $listing, int $promotePlanId, string $currency, ?string $return_url = null, ?string $cancel_url = null)
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
     */
    private function createPayment(AdvertListing $listing, AdvertPromotePlan $promotePlan, string $currency, ?string $return_url = null, ?string $cancel_url = null)
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
                'email' => Auth::user()->email,
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
     * Retrieve filtered adverts with optimized queries and structure
     */
    public function getAllAdverts(GetAdvertGalleryRequest $request)
    {
        $validated = $request->validated();

        $query = AdvertListing::query()->with(['media', 'category', 'payment', 'promotePlans'])
            ->addSelect([
                'advert_listings.*',
                'min_promote_plan_price' => AdvertPromotePlan::selectRaw('MIN(price)')
                    ->join('advert_listing_promote_plans', 'advert_promote_plans.id', '=', 'advert_listing_promote_plans.advert_promote_plan_id')
                    ->whereColumn('advert_listing_promote_plans.advert_listing_id', 'advert_listings.id')
                    ->groupBy('advert_listing_promote_plans.advert_listing_id')
            ])
            ->when(isset($validated['category_ids']), fn($query) => $query->whereIn('advert_listings.category_id', $validated['category_ids']))
            ->when(
                isset($validated['status']),
                fn($query) => $query->whereExists(
                    fn($subQuery) => $subQuery
                        ->select(DB::raw(1))
                        ->from('advert_listing_promote_plans')
                        ->whereColumn('advert_listing_promote_plans.advert_listing_id', 'advert_listings.id')
                        ->where('status', $validated['status'])
                )
            )->when(
                isset($validated['price_min']),
                fn($query) => $query
                    ->having('min_promote_plan_price', '>=', $validated['price_min'])
            )->when(isset($validated['price_max']), fn($query) => $query->having('min_promote_plan_price', '<=', $validated['price_max']))
            ->when(isset($validated['search']), fn($query) => $query->where(function ($q) use ($validated) {
                $searchTerm = '%' . addcslashes($validated['search'], '%_\\') . '%';
                $q->where('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm);
            }))->when(isset($validated['type']), fn($q) => $q->where('type', $validated['type']))
            ->when($request->hasHeader('currency'), fn($q) => $q->where('currency', $request->header('currency')))
            ->when(isset($validated['country_id']), fn($q) => $q->where('country_id', $validated['country_id']))
            ->when(isset($validated['state']), fn($q) => $q->where('state', $validated['state']))
            ->when(isset($validated['limit']), fn($query) => $query->limit($validated['limit']));
        $perPage = $validated['per_page'] ?? 15;
        $paginator = $query->orderBy('min_promote_plan_price', 'desc')
            ->paginate($perPage)
            ->appends($request->query());

        return [
            'gallery' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage()
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
     * It also supports optional search filtering by title or description.
     */
    public function getUserAdvertWishlist(User $user, Request $request)
    {
        $query = $user->advertWishlists()->with(['user.store', 'media', 'category', 'payment', 'promotePlans']);

        $query->when($request->filled('search'), fn($query) => $query->where(
            fn($q) =>
            $q->where('title', 'like', '%' . $request->input('search') . '%')
                ->orWhere('description', 'like', '%' . $request->input('search') . '%')
        ));

        return $query->latest()->get();
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

    /**
     * Store advert ratings and reviews.
     *
     * @param AdvertListing $advert The advert listing to rate.
     * @param array $validatedData The validated rating and review data.
     * @param User|null $user The user submitting the rating and review.
     *
     * @return AdvertRating
     */
    public function storeAdvertRating(AdvertListing $advert, array $validatedData, ?User $user = null)
    {
        $identifierColumn = $user ? 'user_id' : 'guest_id';
        $identifierValue  = $user ? $user->id : request()->ip();
        $existingAdvert = AdvertRating::where('advert_listing_id', $advert->id)->where($identifierColumn, $identifierValue)->exists();
        abort_if($existingAdvert, 422, 'You have already rated this advert.');

        return AdvertRating::create([
            'advert_listing_id' => $advert->id,
            'rating' => $validatedData['rating'],
            'review' => $validatedData['review'] ?? null,
            'user_id' => $user ? $user->id : null,
            'guest_id' => $user ? null : request()->ip(),
            'name' => $validatedData['name'] ?? null,
        ]);
    }

    /**
     * Get  all ratings and reviews for an advert.
     * @param AdvertListing $advert The advert listing to get ratings for.
     * @return array An array containing the ratings, average rating, and total ratings.
     */
    public function getAdvertRatings(AdvertListing $advert)
    {
        $ratings = $advert->ratings()->with('user')->latest()->get();
        $averageRating = $ratings->avg('rating');
        $totalRatings = $ratings->count();
        return [
            'ratings' => $ratings,
            'average_rating' => $averageRating,
            'total_ratings' => $totalRatings
        ];
    }
}
