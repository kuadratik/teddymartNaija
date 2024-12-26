<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * PriceQuantityRule is a validation rule that ensures a minimum quantity
 * requirement based on the price. If the price is below 1,000,000, the
 * quantity must be at least 5.
 */
class PriceQuantityRule implements ValidationRule
{
    protected $price;

    /**
     * Constructor to pass the price.
     *
     * @param float|null $price
     */
    public function __construct(float $price)
    {
        $this->price = $price;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed   $value
     * @param  \Closure(string, \Illuminate\Translation\PotentiallyTranslatedString): void  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->price < 1000000 && $value < 5) {
            $fail('For prices below 1,000,000, the quantity must be at least 5.');
        }
    }
}
