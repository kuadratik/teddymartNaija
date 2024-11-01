<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertPromotePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'duration_days'
    ];

    /**
     * Get all Advert Listings for this  Advert Promotion Plan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function advertListings()
    {
        return $this->hasMany(AdvertListing::class);
    }
}
