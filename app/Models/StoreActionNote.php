<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreActionNote extends Model
{
    /**
     * The attributes that are mass assignable
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'admin_id',
        'note'
    ];
}
