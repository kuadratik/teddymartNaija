<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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

    /**
     * Get the user for this chat user type
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Query scope to retrieve for auth participant
     */
    public function scopeAuthUser(Builder $query)
    {
        return $query->where('user_id', auth()->id());
    }

    /**
     * Query scope to retrieve last read in subquery
     */
    public function scopeSubLastRead(Builder $query)
    {
        return $query->select('read_at')->whereColumn('chat_id', 'chats.id')
            ->where('user_id', auth()->id())->take(1);
    }
}
