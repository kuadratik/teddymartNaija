<?php

namespace App\Enums;

enum PaymentType: string
{
    case CHECKOUT = 'checkout';
    case ADVERT = 'advert';
    case PROMOTION = 'promotion';
    case VENDOR = 'vendor';
}
