<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\AdvertListingPromotePlan;
use App\Models\AdvertPromotePlan;
use App\Notifications\Listing\Ads24hrsExpiredNotification;
use App\Notifications\Listing\AdsExpiredNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckExpiredAdverts extends Command
{
    protected $signature = 'advert:check-expired-adverts';
    protected $description = 'Check for expired Adverts records and update to Free plan. Send email notifications 24 hours before expiry.';

    public function handle()
    {
        $this->updateExpiredPlans();
        $this->sendExpiryNotifications();
    }

    protected function updateExpiredPlans()
    {
        $expiredPlans = $this->getExpiredPlans();

        if ($expiredPlans->isEmpty()) {
            $this->info('No expired plans found.');
            return;
        }

        $expiredPlans->each(function ($plan) {
            if (!$user = optional($plan->advertListing)->user) {
                Log::warning("No user associated with plan id: {$plan->id}");
                return;
            }

            try {
                $user->notify(new AdsExpiredNotification);
                $this->updatePlanStatus($plan, OrderStatusEnum::EXPIRED->value);
                $this->revertToFreePlan($plan);
            } catch (\Exception $e) {
                Log::error("Failed to process plan {$plan->id}: " . $e->getMessage());
            }
        });

        $this->info("Processed {$expiredPlans->count()} expired plans.");
    }

    protected function sendExpiryNotifications()
    {
        $expiringPlans = $this->getPlansExpiringIn24Hours();

        if ($expiringPlans->isEmpty()) {
            $this->info('No plans expiring soon found.');
            return;
        }

        $expiringPlans->each(function ($plan) {
            $cacheKey = $this->getNotificationCacheKey($plan->id);

            if (cache()->has($cacheKey) || !$user = optional($plan->advertListing)->user) {
                return;
            }

            try {
                $user->notify(new Ads24hrsExpiredNotification($plan));
                cache()->put($cacheKey, true, now()->addDay());
            } catch (\Exception $e) {
                Log::error("Failed to send notification for plan {$plan->id}: " . $e->getMessage());
            }
        });

        $this->info("Sent notifications for {$expiringPlans->count()} plans.");
    }

    private function getExpiredPlans()
    {
        return AdvertListingPromotePlan::with(['advertListing.user', 'advertPromotePlan'])
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->where('status', OrderStatusEnum::ACTIVE)
            ->get()
            ->each(function ($plan) {
                Log::info("Processing expired plan ID: {$plan->id}");
            });
    }

    private function getPlansExpiringIn24Hours()
    {
        return AdvertListingPromotePlan::with(['advertListing.user'])
            ->whereBetween('expires_at', [now(), now()->addDay()])
            ->where('status', OrderStatusEnum::ACTIVE)
            ->get()
            ->each(function ($plan) {
                Log::info("Processing expiring soon plan ID: {$plan->id}");
            });
    }

    private function revertToFreePlan(AdvertListingPromotePlan $plan)
    {
        $freePlan = AdvertPromotePlan::where('currency', $plan->advertPromotePlan->currency)
            ->where('price', 0)
            ->first();

        if (!$freePlan) {
            Log::error("No free plan available for currency: {$plan->advertPromotePlan->currency}");
            return;
        }

        $plan->update([
            'advert_promote_plan_id' => $freePlan->id,
            'expires_at' => null,
            'started_at' => now(), // Reset start date for new plan
            'payment_id' => null
        ]);
    }

    private function updatePlanStatus(AdvertListingPromotePlan $plan, string $status)
    {
        $plan->update(['status' => $status]);
    }

    private function getNotificationCacheKey(int $planId): string
    {
        return "ads:notification:24hr:{$planId}";
    }
}
