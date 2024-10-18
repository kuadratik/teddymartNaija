<?php

namespace App\Http\Requests\Payment;

use App\Enums\CurrencyCodeEnum;
use App\Enums\PaymentGatewayEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class VerifyPaymentRequest extends FormRequest
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
            'gateway' => ['required', 'string', Rule::enum(PaymentGatewayEnum::class)],
            'token' => ['required', 'string']
        ];
    }


    public function getPaymentAtribute($cartId): array
    {
        return $this->collect($this->validated())->merge([
            'cart_id' => $cartId
        ])->toArray();
    }
}
