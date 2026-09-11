<?php

namespace App\Console\Commands;

use App\Actions\FetchStoresAlphaNumericallyAction;
use App\Enums\CurrencyCodeEnum;
use App\Enums\CurrencyType;
use App\Enums\StoreType;
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
    public function handle(FetchStoresAlphaNumericallyAction $storeAction)
    {
        collect(CurrencyCodeEnum::cases())->each(
            fn(CurrencyCodeEnum $currency) => collect(StoreType::cases())->each(
                fn($type) => $storeAction->commandKeyedStoreList($currency, $type)
            )
        );
    }
}
