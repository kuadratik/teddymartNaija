<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvertRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'advert_listing_id',
        'user_id',
        'guest_id',
        'rating',
        'review',
        'name',
    ];

    /**
     * Get the advert listing that the rating belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function advertListing(): BelongsTo
    {
        return $this->belongsTo(AdvertListing::class);
    }


    /**
     * Get the user that the rating belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
