<?php

namespace App\Enums;

enum ShippingMethodEnum: string
{
    case VENDOR_FULFILLED_SHIPPING = 'vendor-fulfilled shipping';
    case STORE_PICK_UP = 'store pick-up';
    case FEZ_DELIVERY = 'fez-delivery';
}
