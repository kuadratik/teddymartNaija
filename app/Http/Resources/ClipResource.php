<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClipResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store->id,
            'store_name' => $this->store->name,
            'store_currency_code' => $this->store->country->currency_code,
            'store_currency_name' => $this->store->country->currency_name,
            'number_of_listings' => $this->products->count(),
            'total_amount' => $this->products->sum('price'),
            'store_image' => $this->store->profile_picture_path,
            'store_whatsapp_number' => $this->store->whatsapp_number,
            'store_contact_number' => $this->store->contact_number,
            'has_orders' => $this->has_orders,
            'order_id' => $this->order_id,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
