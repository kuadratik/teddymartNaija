<?php

namespace App\Http\Requests\Store;

use App\Enums\DurationTypeEnum;
use App\Enums\ShippingMethodEnum;
use App\Models\StoreShippingMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class SaveShippingMethodRequest extends FormRequest
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
            'id' => ['nullable', 'integer'],
            'store_id' => ['required', Rule::exists('stores', 'id')->where('user_id', $this->user()->id)],
            'method_type' => ['required', new Enum(ShippingMethodEnum::class)],
            'pick_up_time' => [Rule::requiredIf($this->method_type === ShippingMethodEnum::STORE_PICK_UP->value), 'string'],
            'pick_up_location' => [Rule::requiredIf($this->method_type === ShippingMethodEnum::STORE_PICK_UP->value), 'string'],
            'fulfilled_amount' => [Rule::requiredIf($this->method_type === ShippingMethodEnum::VENDOR_FULFILLED_SHIPPING->value), 'string'],
            'fulfilled_location' => [Rule::requiredIf($this->method_type === ShippingMethodEnum::VENDOR_FULFILLED_SHIPPING->value), 'string'],
            'duration_number' => ['nullable', 'integer', 'min:1'],
            'duration_type' => ['nullable', Rule::enum(DurationTypeEnum::class)],

        ];
    }

    public function storePickUpAttributes()
    {
        return collect([
            'id' => $this->id,
            'store_id' => $this->store_id,
            'method_type' => ShippingMethodEnum::STORE_PICK_UP->value,
            'pick_up_time' => $this->pick_up_time,
            'location' => $this->pick_up_location,
            'is_unique' => true,
            'duration_number' => $this->duration_number,
            'duration_type' => $this->duration_type,
        ])->toArray();
    }

    public function vendorFulfilledAttributes()
    {
        return collect([
            'id' => $this->id,
            'store_id' => $this->store_id,
            'method_type' => ShippingMethodEnum::VENDOR_FULFILLED_SHIPPING->value,
            'amount' => $this->fulfilled_amount,
            'location' => $this->fulfilled_location,
            'duration_number' => $this->duration_number,
            'duration_type' => $this->duration_type,
        ])->toArray();
    }

    /**
     * Save shipping method
     */
    public function saveMethod()
    {
        match ($this->method_type) {
            ShippingMethodEnum::STORE_PICK_UP->value => StoreShippingMethod::updateOrCreate([
                'store_id' => $this->storePickUpAttributes()['store_id'] ?? null,
                'method_type' => $this->storePickUpAttributes()['method_type']
            ], [
                ...$this->storePickUpAttributes()
            ]),
            ShippingMethodEnum::VENDOR_FULFILLED_SHIPPING->value => StoreShippingMethod::updateOrCreate([
                'id' => $this->vendorFulfilledAttributes()['id'] ?? null,
                'method_type' => $this->vendorFulfilledAttributes()['method_type']
            ], [
                ...$this->vendorFulfilledAttributes()
            ])
        };
    }
}
