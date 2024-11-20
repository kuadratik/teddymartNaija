<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreShippingMethod extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
     protected $fillable = [
        'store_id',
        'method_type',
        'pick_up_time',
        'location',
        'amount',
        'is_unique',
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'is_unique',
    ];
}
