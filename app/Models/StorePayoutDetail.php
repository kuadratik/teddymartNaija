<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StorePayoutDetail extends Model
{
     /**
      * The attributes that are mass assignable.
      *
      * @var array<int, string>
      */
     protected $fillable = [
          'store_id',
          'bank_name',
          'account_name',
          'account_number',
          'is_default',
          'detail_type',
          'bank_code',
          'iban',
          'institution_number',
          'transit_number',
          'sort_code',
          'interac_information',
        'zelle_information',
        'paystack_recipient_code'
     ];

     public function store()
     {
          return $this->belongsTo(Store::class);
     }
}
