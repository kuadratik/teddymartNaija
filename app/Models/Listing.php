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
        $query->where('is_available',  filter_var($isAvailable , FILTER_VALIDATE_BOOL));
    }
}
