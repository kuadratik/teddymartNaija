<?php

namespace App\Models;

use App\Enums\BusinessListing\AvailibilityTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessServiceAvailability extends Model
{
    protected $fillable = [
        'business_listing_id',
        'service_name',
        'availability_type',
    ];

    protected $casts = [
        'availability_type' => AvailibilityTypeEnum::class,
    ];

    public function businessListing(): BelongsTo
    {
        return $this->belongsTo(BusinessListing::class);
    }

    public function timeSlots(): HasMany
    {
        return $this->hasMany(BusinessServiceTimeSlot::class, 'business_availability_id');
    }
}
