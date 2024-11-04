<?php

namespace App\Enums;

enum PaymentType: string
{
    case CHECKOUT = 'checkout';
    case ADVERT = 'advert';
}
