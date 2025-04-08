<?php

namespace App\Console\Commands;

use App\Models\Listing;
use App\Models\ListingVariant;
use Illuminate\Console\Command;

class UpdateDisplayPrices extends Command
{
    protected $signature = 'prices:update-display';
    protected $description = 'Update all listing display prices based on current company rate';

    public function handle()
    {
        $companyRate = env('COMPANY_RATE', 0.13);
        $totalListings = Listing::count();

        if ($totalListings === 0) {
            $this->info('No listings found to update.');
            return;
        }

        $this->info("Starting price updates with company rate: {$companyRate}");
        $progress = $this->output->createProgressBar($totalListings);
        $progress->start();

        $updatedCount = 0;

        Listing::chunk(100, function ($listings) use ($companyRate, $progress, &$updatedCount) {
            foreach ($listings as $listing) {
                $basePrice = $listing->discount > 0
                    ? $listing->price * (1 - ($listing->discount / 100))
                    : $listing->price;

                $listing->update([
                    'display_price' => $basePrice * (1 + $companyRate)
                ]);

                foreach ($listing->variants as $variant) {
                    $variantBasePrice = $variant->discount > 0
                        ? $variant->price * (1 - ($variant->discount / 100))
                        : $variant->price;

                    $variant->update([
                        'display_price' => $variantBasePrice * (1 + $companyRate)
                    ]);
                }

                $updatedCount++;
                $progress->advance();
            }
        });

        $progress->finish();
        $this->newLine();
        $this->info("Successfully updated {$updatedCount} listings with new display prices.");
    }
}
