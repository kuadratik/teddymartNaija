<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand_category_id',
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
     * Relationship: Brand belongs to a category
     */
    public function category()
    {
        return $this->belongsTo(BrandCategory::class, 'brand_category_id');
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
