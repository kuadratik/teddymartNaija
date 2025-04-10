<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserShippingAddress extends Model
{
    use HasFactory,SoftDeletes;


    protected $fillable = [
        'user_id',
        'country',
        'state',
        'lga',
        'city',
        'landmark',
        'address',
        'saved',
        'first_name',
        'last_name',
        'phone',
        'email',

    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'saved' => 'boolean',
        ];
    }

    /**
     * Get the formatted full address
     *
     * @return string
     */
    public function getFormattedAddress(): string
    {
        return implode(', ', array_filter([
            $this->address,
            $this->landmark,
            $this->city,
            $this->lga,
            $this->state,
            $this->country
        ]));
    }

    /**
     * Define a relationship where this user shipping address belongs to a user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define a relationship where this user shipping address has many orders.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }
}
