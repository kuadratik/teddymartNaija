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
        $outOfStockListings = Listing::where('quantity', '<', 2)
            ->where('price', '<', 1000000)
            ->with('store.user')
            ->get()
            ->groupBy('store_id');

        foreach ($outOfStockListings as $storeId => $listings) {
            $store = Store::find($storeId);
            $vendor = $store->user;

            $productDetails = $listings->map(function ($listing) {
                return "{$listing->name}: {$listing->quantity} units remaining";
            })->implode("\n");

            $vendor->notify(new OutOfStockNotification($vendor->first_name, $productDetails));
        }

        $this->info('Out-of-stock notifications sent to vendors.');
    }
}
