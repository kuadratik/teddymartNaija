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

    /**
     * @todo theres is a bug on the cast it should be casts but i left it cause frontend it will affect them cause they are already decoding the json
     * The attributes that should be casts
     */
    protected $cast = [
        'size' => 'array',
        'tags' => 'array',
        'measurement' => 'array',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
