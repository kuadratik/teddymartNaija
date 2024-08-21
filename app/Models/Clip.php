<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clip extends Model
{
    use HasFactory;
    protected $fillable = [
        'store_id',
        'user_id',
    ];


    /**
     * The products that belong to the clip.
     */
    public function products()
    {
        return $this->belongsToMany(Listing::class, 'clip_listing', 'clip_id', 'listing_id')
        ->withTimestamps();
    }

    /**
     * Get the store that owns the clip.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the user that owns the clip.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Add a product to the clip.
     */
    public function addProduct(Listing $listing)
    {
        $existingProduct = $this->products()->where('listing_id', $listing->id)->exists();

        if ($existingProduct) {
            return false;
        } else {
            $this->products()->attach($listing->id);
            return true;
        }
    }
}
