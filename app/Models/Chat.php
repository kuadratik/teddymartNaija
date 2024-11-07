<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
     /**
     * The attributes that are mass assignable
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'uid',
        'user_id',
        'user_type',
        'converse_type',
        'title',
        'identifier'
    ];

     /**
     * The attributes that should be hidden for serialization
     * 
     * @var array<string, string>
     */
    protected $hidden = [
        'identifier'
    ];

    /**
     * Get the messages for this chat
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
