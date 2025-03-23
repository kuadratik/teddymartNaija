<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ListingVariant;

class CheckExpiredVariantDiscounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'discounts:check-expired-variants';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired discounts on listing variants and reset prices to the original display price';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired variant discounts...');

        $currentDate = now();

        $expiredVariants = ListingVariant::where('discount_end_date', '<', $currentDate)->get();

        foreach ($expiredVariants as $variant) {
            $originalPrice = $variant->discount > 0
                ? $variant->display_price / (1 - ($variant->discount / 100))
                : $variant->display_price;

            $variant->update([
                'display_price' => $originalPrice,
                'discounted_price' => null,
                'discount' => null,
                'discount_start_date' => null,
                'discount_end_date' => null,
            ]);
        }

        $this->info('Expired variant discounts have been processed successfully.');
    }
}
