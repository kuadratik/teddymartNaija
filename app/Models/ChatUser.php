<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatUser extends Model
{
    /**
     * The attributes that are mass assignable
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'chat_id',
        'user_type',
        'user_id',
        'read_at',
        'is_removed'
    ];

    /**
     * The attributes that should be hidden for serialization
     * 
     * @var array<string, string>
     */
    protected $hidden = [
        'userable'
    ];

    /**
     * The attributes that should be casts.
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'is_removed' => 'boolean',
    ];
}
