<?php

namespace App\Jobs;

use App\Models\Listing;
use App\Models\ListingVariant;
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

    public $tries = 3;

    public $timeout = 120;

    public function __construct()
    {
        //
    }

    /**
     * Handles the expiration of discounts for listings and their variants.
     *
     * This method retrieves all listings and variants with expired discounts
     * and resets their prices and discount-related fields to their original
     * values. It logs the success or failure of each update operation.
     *
     * @throws \Exception If an error occurs during the update process.
     */
    public function handle()
    {
        $currentDate = now();

        $expiredListings = Listing::where('discount_end_date', '<', $currentDate)
            ->where('is_draft', false)
            ->get();

        foreach ($expiredListings as $listing) {
            try {
                $listing->update([
                    'price' => $listing->display_price,
                    'discounted_price' => null,
                    'discount' => null,
                    'discount_start_date' => null,
                    'discount_end_date' => null
                ]);

                Log::info("Discount expired and reset for listing: {$listing->id}");
            } catch (\Exception $e) {
                Log::error("Failed to update listing {$listing->id}: " . $e->getMessage());
            }
        }

        $expiredVariants = ListingVariant::where('discount_end_date', '<', $currentDate)->get();

        foreach ($expiredVariants as $variant) {
            try {
                $variant->update([
                    'price' => $variant->display_price,
                    'discounted_price' => null,
                    'discount' => null,
                    'discount_start_date' => null,
                    'discount_end_date' => null
                ]);

                Log::info("Discount expired and reset for variant: {$variant->id}");
            } catch (\Exception $e) {
                Log::error("Failed to update variant {$variant->id}: " . $e->getMessage());
            }
        }
    }


    /**
     * Logs an error message when the job fails.
     *
     * @param \Exception $exception The exception that caused the job to fail.
     */
    public function failed(\Exception $exception)
    {
        Log::error('Expired Discounts Job Failed: ' . $exception->getMessage());
    }
}
