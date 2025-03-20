<?php

namespace App\Console\Commands;

use App\Enums\ListingType;
use Illuminate\Console\Command;
use App\Models\Listing;

class RemoveServiceListings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-service-listings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Permanently remove all service-type listings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = Listing::where('type', ListingType::SERVICE);
        $count = $query->count();

        if ($count === 0) {
            $this->info('No service listings found.');
            return;
        }

        if ($this->confirm("This will permanently delete {$count} service listings. Are you sure?")) {
            $progressBar = $this->output->createProgressBar($count);
            $progressBar->start();

            $query->chunk(200, function ($listings) use ($progressBar) {
                foreach ($listings as $listing) {
                    $listing->delete();
                    $progressBar->advance();
                }
            });

            $progressBar->finish();
            $this->newLine(2);
            $this->info("Successfully deleted {$count} service listings.");
        } else {
            $this->info('Operation cancelled.');
        }
    }
}
