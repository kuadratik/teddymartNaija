<?php

namespace App\Models;

use App\Enums\ListingType;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'google_id',
        'clipper_uid',
        'first_name',
        'last_name',
        'email',
        'referral_code',
        'referred_by_user_id',
        'offers_product',
        'offers_service',
        'has_store',
        'has_ads',
        'password',
        'email_verified_at'
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
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'offers_product' => 'boolean',
        'offers_service' => 'boolean',
        'has_store' => 'boolean',
        'has_ads' => 'boolean',
    ];



    protected static function booted()
    {
        static::saving(function ($user) {
            if (empty($user->referral_code)) {
                $user->referral_code =  'REF' . $user->id . Str::upper(Str::random(6));
            }
        });
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
     * Get all of the listings for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function wishlists(): MorphToMany
    {
        return $this->morphedByMany(Listing::class, 'wishlistable', 'wishlists')
            ->withTimestamps();
    }

    /**
     * Get all of the advertListings for the User
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function advertWishlists(): MorphToMany
    {
        return $this->morphedByMany(AdvertListing::class, 'wishlistable', 'wishlists')
            ->withTimestamps();
    }

    /**
     * Check if the user has product wishlist .
     *
     * @param mixed $model
     * @return bool
     */
    public function hasWishlisted($model): bool
    {
        return $this->wishlists()
            ->where('wishlistable_id', $model->id)
            ->where('wishlistable_type', get_class($model))
            ->exists();
    }
    /**
     * Check if the user has an advert wishlist.
     *
     * @param mixed $model
     * @return bool
     */
    public function hasAdvertWishlisted($model): bool
    {
        return $this->advertWishlists()
            ->where('wishlistable_id', $model->id)
            ->where('wishlistable_type', get_class($model))
            ->exists();
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

    /**
     * Get all referrals for the User
     *
     */
    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }
    /**
     * Get all referrals for the User
     *
     */
    public function referredBys()
    {
        return $this->hasMany(Referral::class, 'referred_id');
    }



    /**
     * Get user that referred you
     *
     */
    public function referredBy()
    {
        return $this->belongsTo(User::class, 'referred_by_user_id');
    }


    public function referredUsers()
    {
        return $this->hasMany(User::class, 'referred_by_user_id');
    }

    public function generateReferralCode()
    {
        if (!$this->referral_code) {
            $this->referral_code = 'REF' . $this->id . Str::upper(Str::random(6));
            $this->save();
        }

        return $this->referral_code;
    }
}
