<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Store;
use App\Models\Order;
use App\Enums\OrderStatusEnum;

class UpdateOrderRequest extends FormRequest
{
    protected ?Store $store = null;
    protected ?Order $order = null;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();


        $this->store = Store::find($this->route('store'));

        if (!$this->store || $this->store->user_id !== $user->id) {
            return false;
        }

        $this->order = $this->store->orders()
            ->where('uid', $this->route('order')->uid)
            ->first();

        if (!$this->order) {
            return false;
        }


        if ($this->order->status === OrderStatusEnum::SHIPPED->value) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $allowedStatuses = [
            OrderStatusEnum::DELIVERED->value,
            OrderStatusEnum::NEW->value,
            OrderStatusEnum::SHIPPED->value,
            // OrderStatusEnum::CANCELED->value,
        ];

        return [
            'status' => [
                'required',
                'string',
                'in:' . implode(',', $allowedStatuses)
            ],
        ];
    }

    /**
     * Get custom error messages for validation and authorization failures.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'The order status is required.',
            'status.in' => 'The order status must be a valid status.',
            'authorization' => 'Unauthorized to update this order.',
        ];
    }
}
