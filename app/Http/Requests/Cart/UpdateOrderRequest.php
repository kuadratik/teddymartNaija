<?php

namespace App\Http\Requests\Cart;

use App\Enums\OrderStatusEnum;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

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
                'in:'.implode(',', $allowedStatuses),
            ],
        ];
    }
}
