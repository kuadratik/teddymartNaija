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
        'customer_uid',
        'first_name',
        'last_name',
        'email',
        'phone',
        'order_number',
        'total_amount',
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
        return $this->hasMany(OrderDetail::class);
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
        return $this->belongsTo(User::class, 'customer_uid', 'clipper_uid');
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
}
