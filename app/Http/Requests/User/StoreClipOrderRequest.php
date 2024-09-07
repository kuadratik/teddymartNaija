<?php

namespace App\Http\Requests\User;

use App\Models\Clip;
use Illuminate\Foundation\Http\FormRequest;

class StoreClipOrderRequest extends FormRequest
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
            'first_name' => ['required','string'],
            'last_name' => ['required','string'],
            'email' => ['required','string','email'],
            'phone' => ['required','string','max:14'],
        ];

    }




}
