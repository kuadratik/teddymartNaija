<?php

namespace App\Http\Requests\Cart;

use App\Enums\CurrencyType;
use App\Enums\PaymentGatewayEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\StoreShippingMethod;

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
            'store_shipping_methods' => ['required', 'array', 'min:1'],
            'store_shipping_methods.*.store_id' => ['required', 'integer', 'exists:stores,id'],
            'store_shipping_methods.*.shipping_method_id' => [
                'required',
                'integer',
                'exists:store_shipping_methods,id',
            ],
            'currency_code' => ['required', 'string', Rule::enum(CurrencyType::class)],
            'payment_gateway' => ['required', 'string', Rule::enum(PaymentGatewayEnum::class)],
        ];
    }

    /**
     * After validation logic to ensure the selected shipping method belongs to the correct store.
     */
    protected function passedValidation()
    {
        foreach ($this->store_shipping_methods as $method) {
            $storeId = $method['store_id'];
            $shippingMethodId = $method['shipping_method_id'];

            $isValid = StoreShippingMethod::where('id', $shippingMethodId)
                ->where('store_id', $storeId)
                ->exists();

            if (!$isValid) {
                abort(422, "The shipping method ID {$shippingMethodId} does not belong to store ID {$storeId}.");
            }
        }
    }
}
