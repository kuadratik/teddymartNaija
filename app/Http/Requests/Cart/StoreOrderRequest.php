<?php

namespace App\Http\Requests\Cart;

use App\Enums\CurrencyCodeEnum;
use App\Enums\CurrencyType;
use App\Models\Clip;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\PaymentGatewayEnum;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'phone' => ['required', 'string', 'max:14'],
            'shipping_address_id' => ['required', 'integer', 'exists:user_shipping_addresses,id'],
            'store_shipping_methods' => ['required', 'array'],
            'store_shipping_methods.*' => ['integer', 'exists:store_shipping_methods,id'],
            'currency_code' => ['required', 'string', Rule::enum(CurrencyType::class)],
            'payment_gateway' => ['required', 'string', Rule::enum(PaymentGatewayEnum::class)],

        ];
    }
}
