<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'session_uid'];



    /**
     * get the items in the cart
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function products()
    {
        return $this->belongsToMany(Listing::class, 'cart_listing')
            ->withPivot('quantity', 'is_variant', 'listing_variant_id')
            ->withTimestamps()
            ->with('variants');
    }

    /**
     * get the user who owns the cart
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
