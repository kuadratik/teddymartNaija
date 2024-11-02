<?php

namespace App\Services\Advert;

use App\Models\AdvertListing;
use App\Models\AdvertPromotePlan;
use App\Models\Payment;
use App\Enums\PaymentStatusEnum;
use App\Enums\CurrencyType;
use App\Models\User;
use App\Services\Media\MediaService;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdvertListingService
{

    protected $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }


    /**
     * Create a new advert listing with promotion plan
     */
    public function create(array $attributes): AdvertListing
    {
        return DB::transaction(function () use ($attributes) {
            $mediaPaths = $attributes['media'] ?? [];
            unset($attributes['media']);
            $listing = $this->createListing($attributes);

            if (!empty($mediaPaths)) {
                $this->mediaService->storeMedia($listing->id, $mediaPaths);
            }

            $this->handlePromotion($listing, $attributes['promote_plan_id'], $attributes['currency'] ?? CurrencyType::USD);

            return $listing->load(['promotePlans', 'media']);
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
    private function handlePromotion(AdvertListing $listing, int $promotePlanId, string $currency): void
    {
        $promotePlan = AdvertPromotePlan::findOrFail($promotePlanId);

        if ($promotePlan->price > 0) {
            $this->handlePaidPromotion($listing, $promotePlan, $currency);
        } else {
            $this->handleFreePromotion($listing, $promotePlan);
        }
    }

    /**
     * Handle paid promotion plans
     */
    private function handlePaidPromotion(AdvertListing $listing, AdvertPromotePlan $promotePlan, string $currency): void
    {
        $payment = $this->createPayment($listing, $promotePlan, $currency);

        $listing->promotePlans()->attach($promotePlan->id, [
            'payment_id' => $payment->id,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
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
            'status' => 'active',
            'started_at' => $startedAt,
            'expires_at' => $expiresAt,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Create payment record for paid promotions
     */
    private function createPayment(AdvertListing $listing, AdvertPromotePlan $promotePlan, string $currency): Payment
    {
        return Payment::create([
            'uuid' => Str::uuid(),
            'payable_type' => AdvertListing::class,
            'payable_id' => $listing->id,
            'payer_type' => User::class,
            'payer_id' => auth()->id(),
            'amount' => $promotePlan->price,
            'currency' => $currency,
            'gateway' => config('payments.default_gateway'),
            'description' => "Promotion plan {$promotePlan->name} for listing {$listing->title}",
            'status' => PaymentStatusEnum::PENDING->value,
        ]);
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
}
