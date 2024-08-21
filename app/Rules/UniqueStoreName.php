<?php

namespace App\Rules;

use App\Models\Store;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

use function Laravel\Prompts\suggest;

class UniqueStoreName implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (Store::where('name', $value)->exists()) {

            $fail("{$value} is taken, try " . $this->suggestAnotherName($value));
        }
    }

    /**
     * Suggest another store name.
     */
    private function suggestAnotherName($value)
    {
        $suggestedName = $value . " " . rand(10, 1000);

        if (Store::where('name', $suggestedName)->exists()) {
            self::suggestAnotherName($value);
        }

        return $suggestedName;
    }
}
