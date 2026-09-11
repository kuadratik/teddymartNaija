<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reference',
        'store_id',
        'order_id',
        'is_approved',
        'amount',
        'currency',
        'transfer_recipient',
        'transfer_code',
        'account_number',
        'bank_code',
        'bank_name',
        'status',
        'provider_status',
        'provider',
    ];


    /**
     * Get the store that owns the Payout
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }


    /**
     * Get the order that owns the Payout
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
