<?php

namespace App\Console\Commands;

use App\Models\AdvertListingPromotePlan;
use Illuminate\Console\Command;

class CheckExpiredPlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'advert:check-expired-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired AdvertListingPromotePlan records and update their status to "free"';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->updateExpiredPlans();
    }

    protected function updateExpiredPlans()
    {
        $expiredPlans = $this->getExpiredPlans();

        foreach ($expiredPlans as $plan) {
            $this->updatePlanStatus($plan, 'free');
        }
    }

    protected function getExpiredPlans()
    {
        return AdvertListingPromotePlan::where('expires_at', '<', now())
            ->where('status', '!=', 'free')
            ->get();
    }

    protected function updatePlanStatus(AdvertListingPromotePlan $plan, string $status)
    {
        $plan->status = $status;
        $plan->save();
    }
}
