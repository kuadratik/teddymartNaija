<?php

namespace App\Models;

use App\Enums\DurationTypeEnum;
use Illuminate\Database\Eloquent\Model;

class StoreShippingMethod extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
     protected $fillable = [
        'id',
        'store_id',
        'method_type',
        'pick_up_time',
        'location',
        'amount',
        'is_unique',
        'duration_number',
        'duration_type',
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'is_unique',

    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_unique' => 'boolean',
        'duration_number' => 'integer',
        'duration_type' => DurationTypeEnum::class,
    ];
}
