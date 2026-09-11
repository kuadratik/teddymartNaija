<?php

namespace App\Http\Requests\Admin;

use App\Enums\GeneralEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:250', 'unique:admins,email,' . $this->route()->parameter('admin')->id],
            'password' => ['nullable', 'string', 'max:50'],
            'role' => ['required', Rule::in([GeneralEnum::PRODUCT_MANAGER])],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['required', 'string', 'exists:permissions,key']
        ];
    }
}
