<?php

namespace App\Enums;

enum CurrencyType: string
{
    case AUD = 'AUD';
    case CAD = 'CAD';
    case USD = 'USD';
    case GBP = 'GBP';
    case EUR = 'EUR';
    case NGN = 'NGN';


    public static function getSupportedCurrencyCodes(): array
    {
        return array_column(self::cases(), 'value');
    }
}
