<?php
namespace App\Rules;

use App\Enums\CurrencyType;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Country;
use App\Enums\SupportedCurrencies;

class SupportedCountry implements ValidationRule
{
/**
* Run the validation rule to check if country is supported.
*
* @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
*/
public function validate(string $attribute, mixed $value, Closure $fail): void
{

$country = Country::find($value);

if (!$country) {

$fail('The selected country does not exist.');
return;
}

if (!in_array($country->currency_code, CurrencyType::getSupportedCurrencyCodes())) {
$fail('The selected country does not support the allowed currencies.');
}
}
}
