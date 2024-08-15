<?php

namespace App\Http\Requests\Auth;

use App\Rules\ValidOtp;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class VerifyOtpRequest extends FormRequest
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
            'first_name' =>  ['required', 'string'],
            'last_name' =>  ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'code' => ['required', 'string', 'min:5', 'max:5', new ValidOtp($this->email)]
        ];
    }


    /**
     *  registration attributes
     */
    public function registerAttribute(): array
    {
        return $this->safe()->all();
    }
}
