<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'logo_url',
        'source_url',
        'target_url',
        'is_active',
        'is_archived',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Relationship: Brand belongs to many categories
     */
    public function categories()
    {
        return $this->belongsToMany(BrandCategory::class, 'brand_category_pivot');
    }

    /**
     * Scope for active brands
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Accessor for formatted name
     */
    public function getFormattedNameAttribute(): string
    {
        return ucfirst($this->name);
    }
}
