<?php

namespace App\Models;

use App\Enums\ListingType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    ];

    protected $casts = [
        'price_on_request' => 'boolean',
        'quantity' => 'integer',
        'type' => ListingType::class,
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
     * Get the promote plan associated with the advert listing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function promotePlan()
    {
        return $this->belongsTo(AdvertPromotePlan::class);
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
}
