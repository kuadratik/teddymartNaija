<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrandHistory extends Model
{
    protected $fillable = [
        'brand_id',
        'admin_id',
        'brand_name',
        'admin_name',
        'old_slug',
        'old_target_url',
        'old_source_url',
        'new_slug',
        'new_target_url',
        'new_source_url',
        'note',
    ];
}
