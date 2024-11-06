<?php

namespace App\Services\Advert;

use App\Models\AdvertListing;
use App\Models\AdvertPromotePlan;
use App\Models\Payment;
use App\Enums\PaymentStatusEnum;
use App\Enums\CurrencyType;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentType;
use App\Models\User;
use App\Services\Media\MediaService;
use App\Services\PaymentGateways\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdvertListingService
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
        }else{
            $paymentData = [
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
        $query = AdvertListing::query()
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
