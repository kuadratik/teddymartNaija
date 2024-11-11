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
        abort_if($listing->status !== OrderStatusEnum::PENDING->value, 400, 'store is already pending payment active');
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
     * Cancel a promotion
     */
    public function cancelPromotion(AdvertListing $listing, AdvertPromotePlan $promotePlan): void
    {

        $listing = StorePromotePlanStore::where('store_id', $listing->store_id)->first();

        $listing->status = OrderStatusEnum::EXPIRED;
        $listing->expires_at = now();
        $listing->update();
    }

    /**
     * Check and update expired promotions
     */
    public function checkExpiredPromotions(): void
    {
        DB::table('store_promote_plan_store')
            ->where('status', PaymentStatusEnum::SUCCESS->value)
            ->where('expires_at', '<=', now())
            ->update(['status' => 'expired']);
    }


    /**
     * Get advert promotion plans based on the provided currency.
     */
    public function getPromotionPlans($currency)
    {
        return StorePromotePlan::where('currency', $currency)->get();
    }



    /**
     * Retrieve all adverts based on the provided request filters.
     */
    public function getStoresWithActivePromotions()
    {
        $stores = Store::whereHas('promotedStores', function ($query) {
            $query->where('status', OrderStatusEnum::ACTIVE);
        })
            ->with('promotedStores.storePromotePlan')
            ->get();

        return $stores;
    }
}
