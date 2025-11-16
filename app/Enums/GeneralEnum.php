<?php

namespace App\Enums;

enum GeneralEnum: string
{
   case STORE = 'store';
   case FAILED = 'failed';
   case PENDING = 'pending';
   case SUCCESS = 'success';
   case UNPAID = 'unpaid';

   // roles enum

   public static function permissions()
   {
      return [
         
      ];
   }
}
