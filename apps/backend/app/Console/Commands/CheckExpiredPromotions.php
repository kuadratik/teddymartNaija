<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\StorePromotePlanStore;
use App\Notifications\Listing\Promotion24hrsExpiredNotification;
use App\Notifications\Listing\PromotionExpiredNotification;
use Illuminate\Console\Command;

class CheckExpiredPromotions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'advert:check-expired-promotions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired Store promotions records. Send email notifications 24 hours before expiry.';

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

            $user = $plan->store->user;

            $user->notify(new PromotionExpiredNotification);

            $this->updatePlanStatus($plan, OrderStatusEnum::EXPIRED->value);
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

            $user = $plan->store->user;
            if ($user) {
                $user->notify(new Promotion24hrsExpiredNotification($plan));

                cache()->put($cacheKey, true, now()->addDay());
            }
        }

        $this->info('Expiry notifications sent successfully.');
    }

    /**
     * Generate a unique cache key for the plan notification.
     */
    protected function getNotificationCacheKey(int $planId): string
    {
        return "promotion_notification_sent_{$planId}";
    }


    /**
     * Get expired plans.
     */
    protected function getExpiredPlans()
    {
        return StorePromotePlanStore::where('expires_at', '<', now())
            ->where('status', OrderStatusEnum::ACTIVE)
            ->get();
    }

    /**
     * Get plans expiring in the next 24 hours.
     */
    protected function getPlansExpiringIn24Hours()
    {
        return StorePromotePlanStore::where('status', OrderStatusEnum::ACTIVE)
            ->whereBetween('expires_at', [now(), now()->addDay()])
            ->get();
    }

    /**
     * Update the status of a given plan.
     */
    protected function updatePlanStatus(StorePromotePlanStore $plan, string $status)
    {
        $plan->status = $status;
        $plan->save();
    }
}
