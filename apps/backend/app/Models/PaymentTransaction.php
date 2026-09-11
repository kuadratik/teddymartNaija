<?php

namespace App\Models;

use App\Enums\PaymentTransactionTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PaymentTransaction extends Model
{


    protected $fillable = [
        'payment_id',
        'reference',
        'type',
        'amount',
        'currency',
        'is_success',
        'status_message',
        'request_payload',
        'response_payload',
        'error_code',
        'error_message',
        'meta'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_success' => 'boolean',
        'request_payload' => 'array',
        'response_payload' => 'array',
        'meta' => 'array'
    ];

    /**
     * Get The Payment that belongs to this transaction.
     *
     * @return BelongsTo
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Scope Successful transactions
     */
    public function scopeSuccessful($query)
    {
        return $query->where('is_success', true);
    }

    /**
     * Scope Failed transactions
     */
    public function scopeFailed($query)
    {
        return $query->where('is_success', false);
    }

    /**
     * Filter the query by a specific type of Payment Transaction.
     */
    public function scopeOfType($query, PaymentTransactionTypeEnum $type)
    {
        return $query->where('type', $type);
    }
}
