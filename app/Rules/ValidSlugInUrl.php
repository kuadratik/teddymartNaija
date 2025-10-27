<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidSlugInUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value) {
            return;
        }

        $slug = basename(parse_url($value, PHP_URL_PATH));
        
        if (strlen($slug) < 3) {
            $fail('The minimum character is 3');
        }
        
        if (strlen($slug) > 15) {
            $fail('The maximum character is 15');
        }
        
        if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
            $fail('Only lowercase letters, numbers, and hyphens are allowed');
        }
    }
}