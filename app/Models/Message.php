<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
     /**
     * The attributes that are mass assignable
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'chat_id',
        'user_id',
        'user_type',
        'content',
    ];

    /**
     * The attributes that should be hidden for serialization
     * 
     * @var array<string, string>
     */
    protected $hidden = [
        'userable'
    ];
    
}
