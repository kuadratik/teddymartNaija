<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string, string>
     */
    protected $fillable = [
        'store_id',
        'user_id',
        'category_id',
        'name',
        'slug',
        'type',
        'price',
        'description',
        'additional_information',
        'is_available',
        'views_count',
        'images'
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * The attributes that should be casts
     */
    protected $casts = [
        'images' => 'array',
        'is_available' => 'boolean'
    ];

    /**
     * The booted method of the model.
     */
    protected static function booted()
    {
        static::saving(function (Listing $model) {
            $model->slug = str($model->name)->slug();
        });
    }

    /**
     * Get the store listing owner
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the user for this store listing
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category for this store listing
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory(Builder $query, string|null $category)
    {
        $query->when($category, fn(Builder $query) =>  $query->where('category_id', $category));
    }

    /**
     * Scope by type
     */
    public function scopeByType(Builder $query, string $type)
    {
        $query->where('type', $type);
    }

    /**
     * Scope by availability
     */
    public function scopeAvailability(Builder $query, $isAvailable)
    {
        $query->where('is_available',  filter_var($isAvailable, FILTER_VALIDATE_BOOL));
    }


    public function scopeByListingType($query, $listingType)
    {
        return $query->where('type', $listingType);
    }


    /**
     * Scope to search by name or store name
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
            ->orWhereHas('store', fn($query) => $query->where('name', 'like', "%{$search}%"));
        });
    }

    /**
     * Scope by popularity (available products or services with highest views_count)
     */
    public function scopePopular(Builder $query, string $type = null)
    {
        $query->where('is_available', true);

        if ($type === 'product' || $type === 'service') {
            $query->where('type', $type);
        }

        $query->orderByDesc('views_count');
    }


   /**
    * get cart that belongs to the listings
    */
    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_listing')
        ->withPivot('quantity')
        ->withTimestamps();
    }
}
