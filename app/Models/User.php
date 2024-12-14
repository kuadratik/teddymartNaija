<?php

namespace App\Models;

use App\Enums\ListingType;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'clipper_uid',
        'first_name',
        'last_name',
        'email',
        'offers_product',
        'offers_service',
        'has_store',
        'has_ads',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'offers_product' => 'boolean',
            'offers_service' => 'boolean',
            'has_store' => 'boolean',
            'has_ads' => 'boolean',
        ];
    }



    /**
     * Get the stores associated with the User, eager loading the country.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function store(): HasMany
    {
        return $this->hasMany(Store::class)->with('country', 'shippingMethods');
    }


    /**
     * get the clips belong to user
     */
    public function clips()
    {
        return $this->hasMany(Clip::class);
    }

    /**
     * get the carts belong to user
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }


    /**
     * Get the full name of the  user.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get all of the shippingAddresses for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function shippingAddresses(): HasMany
    {
        return $this->hasMany(UserShippingAddress::class, 'user_id', 'id');
    }

    /**
     * Get a single shipping address by ID.
     *
     * @param int $id
     * @return UserShippingAddress|null
     */
    public function shippingAddress($id)
    {
        return $this->shippingAddresses()->where('id', $id)->firstOrFail();
    }



    /**
     * Get all saved shipping addresses where 'saved' is true.
     */
    public function savedShippingAddresses(): HasMany
    {
        return $this->hasMany(UserShippingAddress::class, 'user_id', 'id')
            ->where('saved', true);
    }

    /**
     * save product to wishlist
     */
    public function wishlist()
    {
        return $this->belongsToMany(Listing::class, 'wishlists')
            ->withTimestamps();

    }


    /**
     * Get all of the advertListings for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function advertListings(): HasMany
    {
        return $this->hasMany(AdvertListing::class);
    }


}
