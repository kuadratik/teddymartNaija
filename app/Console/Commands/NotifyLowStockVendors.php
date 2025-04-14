<?php

namespace App\Console\Commands;

use App\Models\Listing;
use App\Notifications\Listing\LowStockNotification;
use Illuminate\Console\Command;

class NotifyLowStockVendors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'listings:notify-low-stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email notifications to vendors about low stock products';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Listing::whereBetween('quantity', [3, 4])
            ->where('price', '<', 1000000)
            ->with('store.user')
            ->chunkById(100, function ($listings) {
                $notifications = $listings->map(function ($listing) {
                    $store = $listing->store;
                    $vendor = $store->user;
                $productDetails = "{$listing->name}: {$listing->quantity} units remaining";
                $vendor->notify(new LowStockNotification($vendor->first_name, $productDetails));
                });

                return $notifications;
            });

        $this->info('Low stock notifications sent to vendors.');
    }
}
