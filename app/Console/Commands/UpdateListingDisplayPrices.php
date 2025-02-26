<?php

namespace App\Console\Commands;

use App\Models\Listing;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateListingDisplayPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'listings:update-display-prices {--chunk=100 : Number of records to process at once}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update display prices for listings that don\'t have them set';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting to update listing display prices...');

        $totalListings = Listing::whereNull('display_price')
            ->orWhere('display_price', 0)
            ->count();

        if ($totalListings === 0) {
            $this->info('No listings found that need display price updates.');
            return Command::SUCCESS;
        }

        $this->info("Found {$totalListings} listings that need display price updates.");

        $chunkSize = (int) $this->option('chunk');
        $companyRate = env('COMPANY_RATE', 0.13);
        $bar = $this->output->createProgressBar($totalListings);
        $bar->start();

        $updated = 0;
        $errors = 0;

        Listing::whereNull('display_price')
            ->orWhere('display_price', 0)
            ->chunkById($chunkSize, function ($listings) use ($bar, $companyRate, &$updated, &$errors) {
                foreach ($listings as $listing) {
                    DB::beginTransaction();
                    try {
                        $basePrice = $listing->discount > 0
                            ? $listing->price * (1 - ($listing->discount / 100))
                            : $listing->price;

                        $listing->display_price = $basePrice * (1 + $companyRate);
                        $listing->save();

                        DB::commit();
                        $updated++;
                    } catch (\Exception $e) {
                        DB::rollBack();
                        $errors++;
                        $this->error("Error updating listing ID {$listing->id}: {$e->getMessage()}");
                    }

                    $bar->advance();
                }
            });

        $bar->finish();
        $this->newLine(2);

        $this->info("Command completed: Updated {$updated} listings successfully.");

        if ($errors > 0) {
            $this->warn("{$errors} listings failed to update. Check the logs for details.");
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
