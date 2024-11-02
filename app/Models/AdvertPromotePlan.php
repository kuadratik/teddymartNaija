<?php

namespace App\Models;

use App\Enums\CurrencyType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertPromotePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'duration_days',
        'currency'
    ];

    protected $casts = [
        'currency' => CurrencyType::class,
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
