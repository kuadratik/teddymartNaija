<?php

namespace App\Http\Requests\Advert;

use Illuminate\Foundation\Http\FormRequest;

class CreateAdvertRequest extends FormRequest
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
            'business_name' => ['required', 'string', 'max:20'],
            'business_description' => ['required', 'string'],
            'business_email' => ['nullable', 'email'],
            'business_address' => ['nullable', 'string'],
            'business_contact_number' => ['required', 'string'],
            'business_logo_url' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'show_business_description' => ['required', 'boolean'],
            'show_business_email' => ['required', 'boolean'],
            'show_business_address' => ['required', 'boolean']
        ];
    }
}
