<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBookBusinessService extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_service_id',
        'business_listing_id',
        'service_time_id',
        'cus_phone_number',
        'cus_email',
        'cus_fullname',
    ];


    /**
     * Get the business listing that owns the UserBookBusinessService
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function businessListing()
    {
        return $this->belongsTo(BusinessListing::class, 'business_listing_id', 'id');
    }

    /**
     * Get the business service that owns the UserBookBusinessService
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function businessService()
    {
        return $this->belongsTo(BusinessServiceAvailability::class, 'business_service_id', 'id');
    }
}
