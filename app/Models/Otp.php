<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array<int, string
     */
    protected $fillable = [
        'email',
        'otp',
        'expires_at',
        'is_used',
    ];

    /**
     * The attributes that should be casts.
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'is_used' => 'boolean',
        'otp' => 'hashed',
    ];

    /**
     * Get the user that owns the Otp
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
