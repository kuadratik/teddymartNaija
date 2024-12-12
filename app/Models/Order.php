<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

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
        'currency',
        'store_shipping_method_id',
        'shipping_address_id'
    ];


    protected $cast =  [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

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
        return $this->belongsTo(StoreShippingMethod::class, 'shipping_method_id', 'id');
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
     * update order status
     */
    public function updateOrderStatus($status)
    {

        $this->status = $status;
        $this->save();
    }
}
