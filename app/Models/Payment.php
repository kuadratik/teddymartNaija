<?php

namespace App\Models;

use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\PaymentTransactionTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Payment extends Model
{
    use  SoftDeletes;

    protected $fillable = [
        'reference',
        'amount',
        'currency',
        'gateway',
        'status',
        'description',
        'meta',
        'period',
        'next_payment_date',
        'is_recurring',
        'refunded_amount',
        'is_refunded',
        'remaining_amount',
        'is_partial',
        'attempt_count',
        'last_attempt_at',
        'error_code',
        'error_message'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refunded_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'meta' => 'array',
        // 'gateway' => PaymentGatewayEnum::class,
        // 'status' => PaymentStatusEnum::class,
        'is_recurring' => 'boolean',
        'is_refunded' => 'boolean',
        'is_partial' => 'boolean',
        'attempt_count' => 'integer',
        'last_attempt_at' => 'datetime',
        'next_payment_date' => 'datetime'
    ];

    protected $attributes = [
        'status' => PaymentStatusEnum::PENDING
    ];


    /**
     * Get the Order for the payment
     */
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_payment')
            ->withTimestamps();
    }

    /**
     * Get all the transactions associated with this payment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    /**
     * Scope PENDING payments
     */
    public function scopePending($query)
    {
        return $query->where('status', PaymentStatusEnum::PENDING);
    }

    /**
     * Scope SUCCESSFUL payments
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', PaymentStatusEnum::SUCCESS);
    }

    /**
     * Scope FAILED payments
     */
    public function scopeFailed($query)
    {
        return $query->where('status', PaymentStatusEnum::FAILED);
    }

    /**
     * Scope REFUNDED payments
     */
    public function scopeRefunded($query)
    {
        return $query->where('is_refunded', true);
    }

    /**
     * Record a new transaction for this payment.
     */
    public function recordTransaction(array $data): PaymentTransaction
    {
        return $this->transactions()->create($data);
    }

    /**
     * Increment the attempt count of the payment and update the timestamp of the last attempt.
     */
    public function incrementAttemptCount(): void
    {
        $this->increment('attempt_count');
        $this->update(['last_attempt_at' => now()]);
    }

    /**
     * Update the payment status to 'SUCCESS' and clear error details.
     */
    public function markAsSuccessful(): void
    {
        $this->update([
            'status' => PaymentStatusEnum::SUCCESS,
            'error_code' => null,
            'error_message' => null
        ]);
    }

    /**
     * Update the payment status to 'FAILED' with the provided error code and message.
     *
     * @param string|null $errorCode The error code associated with the failed payment.
     * @param string|null $errorMessage The error message explaining the reason for the failed payment.
     */
    public function markAsFailed(string $errorCode = null, string $errorMessage = null): void
    {
        $this->update([
            'status' => PaymentStatusEnum::FAILED,
            'error_code' => $errorCode,
            'error_message' => $errorMessage
        ]);
    }

    /**
     * Refunds a specific amount for the payment.
     *
     * Updates the refunded amount and checks if the payment is fully refunded.
     *
     * @param float $amount The amount to be refunded.
     * @return PaymentTransaction The transaction record for the refund.
     */
    public function refund(float $amount): PaymentTransaction
    {
        $this->update([
            'refunded_amount' => $this->refunded_amount + $amount,
            'is_refunded' => $this->amount <= ($this->refunded_amount + $amount)
        ]);

        return $this->recordTransaction([
            'type' => PaymentTransactionTypeEnum::REFUND,
            'amount' => $amount,
            'currency' => $this->currency,
            'is_success' => true
        ]);
    }

    /**
     * Check if the payment can be refunded.
     */
    public function canBeRefunded(): bool
    {
        return $this->status === PaymentStatusEnum::SUCCESS
            && $this->refunded_amount < $this->amount;
    }

    /**
     * Calculate the remaining amount available for refund for this payment.
     */
    public function getRemainingRefundAmount(): float
    {
        return $this->amount - $this->refunded_amount;
    }
}
