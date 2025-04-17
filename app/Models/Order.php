<?php

namespace App\Models;

use App\Enums\OrderStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HandlesDuration;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    use HasFactory, HandlesDuration;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'type',
        'order_number',
        'total_amount',
        'uid',
        'payment_status',
        'shipping_cost',
        'subtotal',
        'type',
        'status',
        'payout_status',
        'currency',
        'store_shipping_method_id',
        'shipping_address_id',
        'delivered_notification_count',
        'shipped_at',
        'vendor_notified_at'
    ];


    protected $casts =  [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'shipped_at' => 'datetime:Y-m-d H:i:s',
        'delivered_notification_count' => 'integer',
    ];


    /**
     * Get the formatted order number attribute.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    public function orderNumber(): Attribute
    {
        return Attribute::make(
            get: fn($value) => substr($value, 0, 8),
        );
    }

    /**
     * Get the details for  the order.
     */
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class)->with('listing:id,images');
    }
    /**
     * Get the shipping method.
     */
    public function shippingMethod()
    {
        return $this->belongsTo(StoreShippingMethod::class, 'store_shipping_method_id', 'id');
    }
    /**
     * Get the store that owns  the order.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    /**
     * Get the customer that owns  the order.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function clip()
    {
        return $this->belongsTo(Clip::class);
    }



    /**
     * Get the full name of the user.
     *
     * @return string
     */
    public function getCustomerNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the full name of the store user.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the shipping address associated with the order.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shippingAddress()
    {
        return $this->belongsTo(UserShippingAddress::class, 'shipping_address_id');
    }

    /**
     * Get the Payment for the order
     */
    public function payments()
    {
        return $this->belongsToMany(Payment::class, 'order_payment')
            ->withTimestamps();
    }

    /**
     * Query scope to get payoutable order
     */
    public function scopePayoutable(Builder $query)
    {
        return $query->whereIn('orders.status', [
            OrderStatusEnum::DELIVERED->value,
        ])->latest('created_at');
    }

    /**
     * Query scope to get retrieve payout in flight
     */
    public function scopePocketablePayout(Builder $query)
    {
        return $query->whereIn('orders.payout_status', [
            OrderStatusEnum::NEW->value,
            OrderStatusEnum::PROCESSING->value
        ])->where('orders.status', OrderStatusEnum::DELIVERED);
    }

    /**
     * Query scope to get retrieve paid payouts
     */
    public function scopePaidPayouts(Builder $query)
    {
        return $query->where('orders.payout_status', OrderStatusEnum::PAID)->latest('id');
    }

    /**
     * Query scope to get retrieve paid payout
     */
    public function scopePaidPayout(Builder $query)
    {
        return $query->where('orders.payout_status', OrderStatusEnum::PAID);
    }

    /**
     * Query scope to get retrieve delivered orders
     */
    public function scopeDelivered(Builder $query)
    {
        return $query->where('orders.status', OrderStatusEnum::DELIVERED);
    }

    /**
     * update order status
     */
    public function updateOrderStatus($status)
    {
        $this->status = $status;
        if ($status === OrderStatusEnum::SHIPPED->value) {
            $this->shipped_at = now();
        }
        $this->save();
    }

    /**
     * Check if shipping duration has elapsed
     */
    public function isShippingDurationElapsed(): bool
    {
        if (
            !$this->shipped_at ||
            !$this->shippingMethod ||
            !$this->shippingMethod->duration_number ||
            !$this->shippingMethod->duration_type
        ) {
            return false;
        }

        $totalHours = $this->calculateHours(
            $this->shippingMethod->duration_number,
            $this->shippingMethod->duration_type
        );

        $elapsedTime = $this->shipped_at->copy()->addHours($totalHours);

        return now()->greaterThanOrEqualTo($elapsedTime);
    }
}
