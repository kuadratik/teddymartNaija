<?php

namespace App\Enums;

enum PaymentTransactionTypeEnum: string
{
    case AUTHORIZATION = 'authorization';
    case CAPTURE = 'capture';
    case CHARGE = 'charge';
    case REFUND = 'refund';
    case VOID = 'void';
    case VERIFICATION = 'verification';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
