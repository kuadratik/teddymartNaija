<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BusinessListing extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'business_name',
        'business_slug',
        'business_description',
        'business_email',
        'business_address',
        'business_contact_number',
        'business_logo_url',
        'category_id',
        'show_business_description',
        'show_business_email',
        'show_business_address',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'show_business_description' => 'boolean',
            'show_business_email' => 'boolean',
            'show_business_address' => 'boolean',
        ];
    }

    /**
     * The booted method of the model.
     */
    protected static function booted()
    {
        static::saving(function (BusinessListing $model) {
            $model->business_slug = str("{$model->business_name}-" . Str::random(6))->slug();
        });
    }

    /**
     * Get the category for this listing
     */
    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }
}
