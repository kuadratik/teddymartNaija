<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Listing;

class CheckExpiredDiscounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'discounts:check-expired-listings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired discounts and reset prices to the original display price';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired discounts...');

        $currentDate = now();

        $expiredProducts = Listing::where('discount_end_date', '<', $currentDate)
            ->where('is_draft', false)
            ->get();

        foreach ($expiredProducts as $product) {
            $originalPrice = $product->discount > 0
                ? $product->display_price / (1 - ($product->discount / 100))
                : $product->display_price;

            $product->update([
                'display_price' => $originalPrice,
                'discounted_price' => null,
                'discount' => null,
                'discount_start_date' => null,
                'discount_end_date' => null,
            ]);
        }

        $this->info('Expired discounts have been processed successfully.');
    }
}
