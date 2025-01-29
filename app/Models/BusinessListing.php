<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class BusinessListing extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'user_id',
        'business_name',
        'business_slug',
        'business_description',
        'business_email',
        'secondary_business_email',
        'business_address',
        'country_id',
        'state',
        'business_contact_number',
        'secondary_contact_number',
        'website_link',
        'color',
        'owner_role',
        'owner_name',
        'business_logo_url',
        'industry_id',
        'show_business_description',
        'show_business_email',
        'show_secondary_email',
        'show_secondary_contact',
        'show_website_link',
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
            'show_secondary_email' => 'boolean',
            'show_secondary_contact' => 'boolean',
            'show_website_link' => 'boolean',
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
