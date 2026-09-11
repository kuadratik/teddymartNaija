<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Listing;
use App\Models\Store;
use App\Notifications\Listing\OutOfStockNotification;

class NotifyOutOfStockVendors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'listings:notify-out-of-stock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email notifications to vendors about out-of-stock products';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Listing::where('quantity', '<', 2)
            ->where('price', '<', 1000000)
            ->with('store', 'store.user')
            ->chunkById(100, function ($listings) {
                $notifications = $listings->map(function ($listing) {
                    $store = $listing->store;
                    $vendor = $store->user;
                $productDetails = "{$listing->name}: {$listing->quantity} units remaining";
                $vendor->notify(new OutOfStockNotification($vendor->first_name, $productDetails));
                });
                return $notifications;
            });

        $this->info('Out-of-stock notifications sent to vendors.');
    }
}
