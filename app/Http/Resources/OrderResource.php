<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;


class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        if ($this->resource instanceof Collection) {
            return $this->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number, // Ensure order_number is part of each order
                    'store_id' => $order->store_id,
                    'uid' => @$order->uid,
                    'type' => $order->type,
                    'customer' => [
                        'first_name' => $order->first_name,
                        'last_name' => $order->last_name,
                        'email' => $order->email,
                        'phone' => $order->phone,
                    ],
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'currency' => $order->currency,
                    'created_at' => $order->created_at->toDateTimeString(),
                    'updated_at' => $order->updated_at->toDateTimeString(),
                    'order_details' => OrderDetailResource::collection($order->orderDetails),
                    'shipping_address' => $order->shippingAddress instanceof Collection
                        ? ShippingAddressResource::collection($order->shippingAddress)
                        : new ShippingAddressResource($order->shippingAddress),
                    'store' => [
                        'id' => $order->store->id,
                        'name' => $order->store->name,
                        'slug' => $order->store->slug,
                        'currency' => $order->store->currency,
                    ],
                ];
            });
        }

        return [
            'id' => $this->id,
            'order_number' => $this->order_number, // Already included here for single order
            'store_id' => $this->store_id,
            'type' => $this->type,
            'customer' => [
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'phone' => $this->phone,
            ],
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'currency' => $this->currency,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'order_details' => OrderDetailResource::collection($this->orderDetails),
            'shipping_address' => $this->shippingAddress instanceof Collection
                ? ShippingAddressResource::collection($this->shippingAddress)
                : new ShippingAddressResource($this->shippingAddress),
            'store' => [
                'id' => $this->store->id,
                'name' => $this->store->name,
                'slug' => $this->store->slug,
                'currency' => $this->store->currency,
            ],
        ];
    }
}
