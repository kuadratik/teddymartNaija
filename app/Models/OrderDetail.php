<?php

namespace App\Models;

use App\Enums\ListingType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderDetail extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'listing_id',
        'listing_name',
        'listing_price',
    ];

    /**
     * eager load relationships
     */
    protected $with = ['userRating'];


    /**
     * Get the order that owns the OrderDetails
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }


    /**
     * Get the listing that owns the OrderDetails
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
    
     /**
     * Get user rating for listing detail
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userRating()
    {
        return $this->hasMany(ListingRating::class, 'listing_id', 'listing_id')
            ->where('user_id', request()->user()->id);
    }
}
