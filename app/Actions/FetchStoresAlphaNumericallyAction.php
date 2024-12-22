<?php

namespace App\Actions;

use App\Enums\CurrencyCodeEnum;
use App\Enums\StoreType;
use App\Models\Store;
use Illuminate\Support\Facades\Cache;

class FetchStoresAlphaNumericallyAction
{
    public function fetch(string $currency, StoreType $storeType)
    {
        $stores = Store::where('currency', $currency)
            ->select('id', 'user_id', 'name', 'slug')
            ->storeType($storeType)->get()
            ->sortBy(fn($store) => $store->name[0], SORT_NATURAL | SORT_FLAG_CASE);

        $groupedStores = $stores->groupBy(function ($store) {
            $firstChar = strtoupper($store->name[0]);

            if (is_numeric($firstChar)) {
                return [0 - 9];
            }

            return $firstChar;
        });

        return $groupedStores;
    }

    /**
     * Return the alpha-numerically cached keyed stores record
     * Currency value from request header
     */
    public function keyedStoreList()
    {
        $currency = strtoupper(request()->header('currency', 'USD'));
        $storeType = StoreType::tryFrom(strtolower(request()->store_type)) ?? StoreType::PRODUCT;

        $cacheKey = "keyed-stores-{$storeType->value}-{$currency}";

        $stores = Cache::remember($cacheKey, 900, fn() => $this->fetch($currency, $storeType));

        if (count($stores) <= 0) {
            Cache::forget($cacheKey);
        }

        return $stores;
    }
    
    /**
     * Return the alpha-numerically cached keyed stores record
     */
    public function commandKeyedStoreList(CurrencyCodeEnum $currency, StoreType $storeType)
    {
        $cacheKey = "keyed-stores-{$storeType->value}-{$currency->value}";
        Cache::forget($cacheKey);

        $stores = Cache::remember($cacheKey, 180, fn() => $this->fetch($currency->value, $storeType));

        if (count($stores) <= 0) {
            Cache::forget($cacheKey);
        }
    }
}
