<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvertListingPromotePlan extends Model
{
    protected $table = 'advert_listing_promote_plans';
    protected $fillable = ['order_number', 'advert_listing_id', 'advert_promote_plan_id', 'payment_id', 'status', 'started_at', 'expires_at'];

    /**
     * Get the associated AdvertPromotePlan details.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function advertPromotePlan()
    {
        return $this->belongsTo(AdvertPromotePlan::class, 'advert_promote_plan_id');
    }


    /**
     * Get the advert listing that owns the AdvertListingPromotePlan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function advertListing(): BelongsTo
    {
        return $this->belongsTo(AdvertListing::class, 'advert_listing_id');
    }
}

