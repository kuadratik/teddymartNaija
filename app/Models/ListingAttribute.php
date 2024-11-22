<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingAttribute extends Model
{
    protected $fillable = [
        'listing_id',
        'measurement',
        'product_model',
        'brand',
        'material',
        'color',
        'size',
        'tags',
        'size_chart_html',
        'size_chart_image'
    ];

    protected $cast = [
        'size' => 'array',
        'tags' => 'array',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
