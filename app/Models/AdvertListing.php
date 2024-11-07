<?php

namespace App\Models;

use App\Enums\CurrencyType;
use App\Enums\ListingType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class AdvertListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'quantity',
        'category_id',
        'condition',
        'description',
        'price_on_request',
        'price',
        'country_id',
        'state',
        'country_code',
        'phone_number',
        'promote_plan_id',
        'currency',
    ];

    protected $casts = [
        'price_on_request' => 'boolean',
        'quantity' => 'integer',
        'type' => ListingType::class,
        'curerency' => CurrencyType::class,

    ];

    /**
     * Get the category that the advert listing belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    /**
     * Get the media associated with the advert listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function media()
    {
        return $this->hasMany(AdvertMedia::class);
    }

    /**
     * Get the user that owns the AdvertListing
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the promote plans associated with the advert listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function promotePlans()
    {
        return $this->belongsToMany(AdvertPromotePlan::class, 'advert_listing_promote_plans')
            ->withPivot(['payment_id', 'status', 'started_at', 'expires_at', 'order_number'])
            ->withTimestamps();
    }
    /**
     * Get the payment associated with this advert listing's promote plan.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOneThrough
     */
    public function payment(): HasOneThrough
    {
        return $this->hasOneThrough(
            Payment::class,
            AdvertListingPromotePlan::class,
            'advert_listing_id',
            'id',
            'id',
            'payment_id'
        );
    }
}
