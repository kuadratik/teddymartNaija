<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoryNote extends Model
{
    /**
     * The attributes that should be fillable
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'note'
    ];
}
