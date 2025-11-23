<?php

namespace App\Enums;

enum GeneralEnum: string
{
   case STORE = 'store';
   case FAILED = 'failed';
   case PENDING = 'pending';
   case SUCCESS = 'success';
   case UNPAID = 'unpaid';
   case ADMIN = 'admin';
   case PRODUCT_MANAGER = 'product_manager';
   case BOTTOM = 'bottom';
   case TOP = 'top'; 

   public static function permissions()
   {
      return [
         
      ];
   }
}
