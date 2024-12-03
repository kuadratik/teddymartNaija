<?php

namespace App\Jobs;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class CheckExpiredDiscountsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Number of times job can be attempted
    public $tries = 3;

    // Maximum execution time
    public $timeout = 120;

    public function __construct()
    {
        //
    }

    public function handle()
    {
        $currentDate = now();

        $expiredProducts = Listing::where('discount_end_date', '<', $currentDate)
            ->where('is_draft', false)
            ->get();

        foreach ($expiredProducts as $product) {
            try {
                $product->update([
                    'price' => $product->display_price,
                    'discounted_price' => null,
                    'discount' => null,
                    'discount_start_date' => null,
                    'discount_end_date' => null
                ]);

                Log::info("Discount expired and reset for product: {$product->id}");
            } catch (\Exception $e) {
                Log::error("Failed to update product {$product->id}: " . $e->getMessage());
            }
        }
    }

    // Handle job failure
    public function failed(\Exception $exception)
    {
        Log::error('Expired Discounts Job Failed: ' . $exception->getMessage());
    }
}
