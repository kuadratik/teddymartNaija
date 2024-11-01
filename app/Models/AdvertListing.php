<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category_id',
        'condition',
        'description',
        'price_on_request',
        'price',
        'location',
        'country_code',
        'phone_number',
        'promote_plan_id',
    ];

    protected $casts = [
        'price_on_request' => 'boolean',
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
}
