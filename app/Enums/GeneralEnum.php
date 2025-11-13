<?php

namespace App\Enums;

enum GeneralEnum: string
{
   case STORE = 'store';
   case PAID = 'paid';
   case UNPAID = 'unpaid';
   case FAILED = 'failed';

   // roles enum
}
