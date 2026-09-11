<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable
     * 
     * @var array<string string>
     */
    protected $fillable = [
        'name',
        'code',
        'phonecode',
        'emoji',
        'currency_code',
        'currency_name',
    ];
}
