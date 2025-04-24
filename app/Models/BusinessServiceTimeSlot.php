<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessServiceTimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_availability_id',
        'day_of_week',
        'start_time',
        'end_time',
        'date',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'date' => 'date'
    ];

    public function serviceAvailability(): BelongsTo
    {
        return $this->belongsTo(BusinessServiceAvailability::class, 'business_availability_id');
    }
}
