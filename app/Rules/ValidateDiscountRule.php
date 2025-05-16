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
            $fail('You are getting this error, one of these may apply: Please reduce your discount percentage. Your product price can not be less than '
                . $minAllowed . ' ' . $this->currency . '.');
        }
    }
}
