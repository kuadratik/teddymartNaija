<?php

namespace App\Actions;

use App\Models\Store;

class FetchStoresAlphaNumericallyAction
{

    public function fetch(string $currency)
    {
        $stores = Store::where('currency', $currency)->select('id', 'name', 'slug')
            ->get()->sortBy(function ($store) {
                return $store->name[0];
            }, SORT_NATURAL | SORT_FLAG_CASE);

        $groupedStores = $stores->groupBy(function ($store) {
            $firstChar = strtoupper($store->name[0]);

            if (is_numeric($firstChar)) {
                return [0 - 9];
            }

            return $firstChar;
        });

        return $groupedStores;
    }
}
