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
     * Get the user for this chat user type
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
