<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidatePriceRule implements ValidationRule
{
    protected string $currency;

    public function __construct(string $currency)
    {
        $this->currency = strtoupper($currency);
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_numeric($value)) {
            return;
        }

        $minimums = [
            'NGN' => 100,
            'USD' => 1,
            'CAD' => 1,
            'EUR' => 1,
            'GBP' => 1,
        ];

        $minAllowed = $minimums[$this->currency] ?? null;

        if ($minAllowed && $value < $minAllowed) {
            $fail("Display price must be greater or equal to {$minAllowed} {$this->currency}/1.");
        }
    }
}
