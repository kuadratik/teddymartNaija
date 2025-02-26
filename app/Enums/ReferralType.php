<?php

namespace App\Enums;

enum ReferralType: string
{
    case VENDOR = 'vendor';
    case CUSTOMER = 'customer';
    case AD_LISTER = 'ad_lister';
    case BUSINESS_OWNER = 'business_owner';
    case RIDER = 'rider';
    case SHIPPER = 'shipper';

}
