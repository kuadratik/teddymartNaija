<?php

namespace App\Console\Commands;

use App\Actions\FetchStoresAlphaNumericallyAction;
use App\Enums\CurrencyType;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CacheStores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cache-stores';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Caches the stores in alphanumeric order for every currencies';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currencyTypes = CurrencyType::cases();

        foreach ($currencyTypes as $currencyType) {

            $cacheKey = "currency_data:{$currencyType->value}";

            $currencyStores = (new FetchStoresAlphaNumericallyAction())->fetch($currencyType->value);

            if (!$currencyStores->isEmpty()) {
                Cache::put($cacheKey, $currencyStores);
            }
        }
    }
}
