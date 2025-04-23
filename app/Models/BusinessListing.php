<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        static::creating(function (BusinessListing $model) {
            $model->business_slug = str("{$model->business_name}-" . Str::random(6))->slug();
        });
    }

    /**
     * Load the country for this listing
     */
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    /**
     * Get the category for this listing
     */
    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }

    /**
     * Scope search
     */
    public function scopeSearch($query, mixed $search)
    {
        return $query->when($search)->where('business_listings.business_name', 'LIKE', "%{$search}%");
    }

    /**
     * scope by industry
     */
    public function scopeByIndustry($query)
    {
        return $query->when(request()->filled('industry'))
            ->whereIn('industry_id', explode(',', request()->industry));
    }

    /**
     * query scope to add location filter
     */
    public function scopeByLocation($query)
    {
        return $query->when(request()->filled('country'))
            ->where('business_listings.country_id', request()->country)
            ->when(request()->filled('state'))
            ->where(fn($q) => $q->where('business_listings.state', request()->country));
    }

    /**
     * scope by industry
     */
    public function scopeByUser($query)
    {
        return $query->when(request()->filled('user'))->where('user_id', request()->user);
    }


    /**
     * Get all of the service availabity for the Business Listing
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function serviceAvailabilities(): HasMany
    {
        return $this->hasMany(BusinessServiceAvailability::class, 'business_listing_id');
    }
}
