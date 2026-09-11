<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class StoreShippingAddressRequest extends FormRequest
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
            'state' => ['required', 'string'],
            'city' => ['required', 'string'],
            'lga' => ['nullable', 'string'],
            'landmark' => ['nullable', 'string'],
            'country' => ['required', 'string'],
            'address' => ['required', 'string'],
            'saved' => ['nullable', 'boolean'],
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'email' => ['required', 'email'],
        ];
    }


    /**
     * Return the shipping address attributes along with the user ID.
     */
    public function shippingAddressAttribute(): array
    {
        return  collect($this->validated())->merge([
            'user_id' => $this->user()->id,
        ])->toArray();
    }
}
