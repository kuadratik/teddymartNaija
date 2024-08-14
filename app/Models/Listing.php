<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        'images'
    ];

    /**
     * The attributes that should be casts
     */
    protected $casts = [
        'images' => 'array',
    ];

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
}
