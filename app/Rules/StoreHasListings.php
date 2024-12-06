<?php

namespace App\Rules;

use App\Models\Store;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\ValidationException;

class StoreHasListings implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentialTranslation  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $store = Store::findOrFail($value);

        $hasListings = $store->listings()->exists();

        if (!$hasListings) {
            throw ValidationException::withMessages([
                'no_product_found' => 'There are no products/services in your store, add product/service to promote your store'
            ]);
        }
    }
}
