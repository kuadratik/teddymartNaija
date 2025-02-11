<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\AdvertListingPromotePlan;
use App\Models\AdvertPromotePlan;
use App\Notifications\Listing\Ads24hrsExpiredNotification;
use App\Notifications\Listing\AdsExpiredNotification;
use Illuminate\Console\Command;

class CheckExpiredAdverts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'advert:check-expired-adverts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired Adverts records and update to Free plan. Send email notifications 24 hours before expiry.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->updateExpiredPlans();
        $this->sendExpiryNotifications();
    }

    /**
     * Update the status of expired plans to "Expired".
     */
    protected function updateExpiredPlans()
    {
        $expiredPlans = $this->getExpiredPlans();

        foreach ($expiredPlans as $plan) {
            if (!$plan->advertListing || !$plan->advertListing->user) {
                $this->warn("No user associated with plan id: {$plan->id}. Skipping.");
                continue;
            }

            $user = $plan->advertListing->user;

            $user->notify(new AdsExpiredNotification);

            $this->updatePlanStatus($plan, OrderStatusEnum::EXPIRED->value);
            $this->updateAdvertListingPromotePlan($plan);
        }

        $this->info('Expired plans updated successfully.');
    }

    /**
     * Send notifications for plans expiring within the next 24 hours.
     */
    protected function sendExpiryNotifications()
    {
        $plansExpiringSoon = $this->getPlansExpiringIn24Hours();

        foreach ($plansExpiringSoon as $plan) {
            $cacheKey = $this->getNotificationCacheKey($plan->id);

            if (cache()->has($cacheKey)) {
                continue;
            }

            $user = $plan->advertListing->user;
            if ($user) {
                $user->notify(new Ads24hrsExpiredNotification($plan));
                cache()->put($cacheKey, true, now()->addDay());
            }
        }

        $this->info('Expiry notifications sent successfully.');
    }

    /**
     * Generate a unique cache key for the notification.
     */
    protected function getNotificationCacheKey(int $planId): string
    {
        return "ads_notification_sent_{$planId}";
    }


    /**
     * Get expired plans.
     */
    protected function getExpiredPlans()
    {
        return AdvertListingPromotePlan::where('expires_at', '<', now())
            ->where('status', OrderStatusEnum::ACTIVE)
            ->whereHas('advertListing.user')
            ->get();
    }

    /**
     * Get plans expiring in the next 24 hours.
     */
    protected function getPlansExpiringIn24Hours()
    {
        return AdvertListingPromotePlan::whereBetween('expires_at', [now(), now()->addDay()])
            ->where('status',  OrderStatusEnum::ACTIVE)
            ->get();
    }

    /**
     * Update the status of a given plan.
     */
    protected function updatePlanStatus(AdvertListingPromotePlan $plan, string $status)
    {
        $plan->status = $status;
        $plan->save();
    }



    /**
     * Revrt advert listing promote plan to free
     */
    protected function updateAdvertListingPromotePlan(AdvertListingPromotePlan $plan)
    {
        $currentPlanCurrency =  $plan->advertPromotePlan->currency;
        $advertPromotePlans = AdvertPromotePlan::where('currency', $currentPlanCurrency)->where('price', 0)->first();
        $plan->advert_promote_plan_id = $advertPromotePlans->id;
        $plan->expired_at = null;
        $plan->started_at = null;
        $plan->payment_id = null;
        $plan->save();
    }
}
