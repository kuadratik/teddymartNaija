<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingVariant extends Model
{
    protected $fillable = [
        'listing_id',
        'name',
        'quantity',
        'price',
        'discount',
        'discounted_price',
        'display_price',
        'size',
        'color',
        'measurement',
        'discount_start_date',
        'discount_end_date',
        'images',
        'weight'
    ];

    protected $casts = [
        'size' => 'array',
        'images' => 'array',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime'
    ];

    protected static function booted()
    {
        static::saving(function ($model) {
            $companyRate = env('COMPANY_RATE', 0.13);
            $basePrice = $model->discount > 0
                ? $model->price * (1 - ($model->discount / 100))
                : $model->price;
            $model->discounted_price = $model->discount > 0 ? $basePrice : null;
            $model->display_price = $basePrice * (1 + $companyRate);
        });
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
