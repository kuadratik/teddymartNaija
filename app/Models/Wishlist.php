<?php

namespace App\Models;

use App\Enums\WishlistType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    protected $table = 'wishlists';
    protected $fillable = ['user_id', 'wishlistable_id', 'wishlistable_type', 'variant_id'];

    public function wishlistable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeProduct($query)
    {
        return $query->where('wishlistable_type', WishlistType::PRODUCT);
    }
}
