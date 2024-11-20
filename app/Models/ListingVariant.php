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
        'images'
    ];

    protected $casts = [
        'images' => 'array',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime'
    ];

    protected static function booted()
    {
        static::saving(function ($model) {
            if ($model->discount > 0) {
                $model->discounted_price = $model->price - ($model->price * ($model->discount / 100));
                $model->display_price = $model->discounted_price + env('COMPANY_RATE', 0.13) * $model->price;
            } else {
                $model->display_price = $model->price + env('COMPANY_RATE', 0.13) * $model->price;
            }
        });
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
