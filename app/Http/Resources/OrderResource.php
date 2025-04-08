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
    public function toArray(Request $request): array
    {
        if ($this->resource instanceof Collection) {
            return [
                'order_number' => $this->first()->order_number,
                'orders' => $this->map(function ($order) {
                    return [
                        'id' => $order->id,
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
                    ];
                })
            ];
        }

        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'type' => $this->type,
            'order_number' => $this->order_number,
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
        ];
    }
}
