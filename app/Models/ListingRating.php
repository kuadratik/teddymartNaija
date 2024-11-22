<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingRating extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string, string>
     */
    protected $fillable = [
        'user_id',
        'listing_id',
        'store_id',
        'rating'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
