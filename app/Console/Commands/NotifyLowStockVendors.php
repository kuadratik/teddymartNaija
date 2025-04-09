<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Listing;
use App\Models\Store;
use App\Notifications\Listing\LowStockNotification;

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
        $lowStockListings = Listing::whereBetween('quantity', [3, 4])
            ->where('price', '<', 1000000)
            ->with('store.user')
            ->get()
            ->groupBy('store_id');

        foreach ($lowStockListings as $storeId => $listings) {
            $store = Store::find($storeId);
            $vendor = $store->user;

            $productDetails = $listings->map(function ($listing) {
                return "{$listing->name}: {$listing->quantity} units remaining";
            })->implode("\n");

            $vendor->notify(new LowStockNotification($vendor->first_name, $productDetails));
        }

        $this->info('Low stock notifications sent to vendors.');
    }
}
