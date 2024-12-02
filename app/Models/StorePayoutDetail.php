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
        'account_number'
    ];

    public function store(){
      return $this->belongsTo(Store::class);
     }
}
