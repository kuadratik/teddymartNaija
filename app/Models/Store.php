<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'contact_number',
        'whatsapp_number',
        'profile_picture_path',
        'banner_path',
        'description',
        'address1',
        'address2',
        'state',
        'city',
        'postal_code',
    ];

    /**
     * Get the store owner
     */
    public function user()
    {
        return $this->belongsTo(user::class);
    }
}
