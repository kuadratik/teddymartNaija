<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{

    case CANCELED = 'canceled';
    case SUCCESS = 'success';
    case FAILED  = 'failed';
    case PENDING  = 'pending';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
