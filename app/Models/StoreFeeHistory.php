<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreFeeHistory extends Model
{
    /**
     * The attributes that are mass assignable
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'status',
        'gateway',
        'currency',
        'amount',
    ];
}
