<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartListing extends Model
{
    use HasFactory;

    // Explicitly set the table name (if it doesn't follow Laravel's pluralization rules)
    protected $table = 'cart_listing';

    // Allow mass assignment for these columns.
    protected $fillable = [
        'cart_id',
        'listing_id',
        'quantity',
        'is_variant',
        'listing_variant_id',
    ];

    /**
     * Get the cart that owns this pivot record.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the listing that is in the cart.
     */
    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * Get the listing variant, if available.
     */
    public function listingVariant()
    {
        return $this->belongsTo(ListingVariant::class, 'listing_variant_id');
    }


}
