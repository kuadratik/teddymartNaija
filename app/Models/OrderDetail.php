<?php

namespace App\Models;

use App\Enums\ListingType;
use Dom\Attr;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class OrderDetail extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'listing_id',
        'listing_name',
        'listing_price',
        'quantity',
        'variant_id',
        'variant_name',
    ];

    /**
     * eager load relationships
     */
    protected $with = ['userRating'];
    protected $appends = ['total_price'];


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
     * Get Listing Variant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ListingVariant::class, 'variant_id', 'id');
    }


    /**
     * Get user rating for listing detail
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function userRating()
    {
        return $this->hasMany(ListingRating::class, 'listing_id', 'listing_id')
            ->where('user_id', Auth::id());
    }


    /**
     * ger the total price of the order detail
     */
    public function totalPrice(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => $attributes['listing_price'] * $attributes['quantity']
        );
    }
}
