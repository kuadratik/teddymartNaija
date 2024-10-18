<?php

namespace App\Http\Requests\Cart;

use App\Enums\CurrencyCodeEnum;
use App\Models\Clip;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\PaymentGatewayEnum;

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
            'currency_code' => ['required', 'string', 'in:' . CurrencyCodeEnum::AUD->value, CurrencyCodeEnum::CAD->value, CurrencyCodeEnum::USD->value, CurrencyCodeEnum::GBP->value,  CurrencyCodeEnum::EUR->value, CurrencyCodeEnum::NGN->value],
            'payment_method' => ['required', 'string', 'in:' . PaymentGatewayEnum::PAYPAL->value, PaymentGatewayEnum::STRIPE->value, PaymentGatewayEnum::PAYSTACK->value],

        ];
    }
}
