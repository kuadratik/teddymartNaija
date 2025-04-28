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
}
