<?php

namespace App\Http\Requests\Admin;

use App\Enums\GeneralEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateStaffRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:250'],
            'last_name' => ['required', 'string', 'max:250'],
            'email' => ['required', 'email', 'max:250', 'unique:admins,email'],
            'password' => ['required', 'string', 'max:50'],
            'role' => ['required', Rule::in([GeneralEnum::ADMIN, GeneralEnum::PRODUCT_MANAGER])],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['required', 'string', 'exists:permissions,key']
        ];
    }
}
