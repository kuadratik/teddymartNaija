<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidateDiscountRule implements ValidationRule
{
    protected $price;
    protected $currency;

    public function __construct($price, $currency)
    {
        $this->price = $price;
        $this->currency = strtoupper($currency);
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_numeric($value) || !is_numeric($this->price)) {
            return;
        }

        $discountedPrice = $this->price - (($value / 100) * $this->price);

        $commissionPercent = config('company.commission_percent', 5);
        $finalPrice = $discountedPrice + (($commissionPercent / 100) * $discountedPrice);

        $minimums = [
            'NGN' => 100,
            'USD' => 1,
            'CAD' => 1,
            'EUR' => 1,
            'GBP' => 1,
        ];

        $minAllowed = $minimums[$this->currency] ?? null;

        if ($minAllowed && $finalPrice < $minAllowed) {
            $fail('Discounts are only available for products priced at'
                . $minAllowed . ' ' . $this->currency . '/1' . ' or more.');
        }
    }
}
