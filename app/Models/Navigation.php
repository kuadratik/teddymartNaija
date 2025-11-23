<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Navigation extends Model
{
    /**
     * The attributes that are mass assignable
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'link',
        'active',
        'coming_soon',
        'icon',
        'subnav',
        'ordering',
        'type'
    ];

    /**
     * The attributes that should be casts
     * 
     * @var array<string, string>
     */
    protected $casts = [
        'active' => 'boolean',
        'coming_soon' => 'boolean',
        'subnav' => 'array'
    ];

    /**
     * Query scope to filter by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('navigations.type', $type);
    }
}
