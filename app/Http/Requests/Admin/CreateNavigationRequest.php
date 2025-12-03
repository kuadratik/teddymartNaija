<?php

namespace App\Http\Requests\Admin;

use App\Enums\GeneralEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateNavigationRequest extends FormRequest
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
            'type' => ['required', Rule::in([GeneralEnum::BOTTOM, GeneralEnum::TOP])],
            'name' => ['required', 'string'],
            'link' => ['required', 'string'],
            'active' => ['required', 'boolean'],
            'coming_soon' => ['required', 'boolean'],
            'icon' => ['nullable', 'string'],
            'subnav' => ['nullable', 'array', 'min:1'],
            'subnav.*.name' => ['required', 'string'],
            'subnav.*.link' => ['required', 'string'],
            'subnav.*.coming_soon' => ['required', 'boolean'],
            'subnav.*.icon' => ['nullable', 'string'],
            'ordering' => ['required'],
        ];
    }
}
