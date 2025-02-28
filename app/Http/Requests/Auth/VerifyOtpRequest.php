<?php

namespace App\Http\Requests\Auth;

use App\Enums\ReferralType;
use App\Rules\ValidOtp;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

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
            'refferalType' => ['nullable', 'string', Rule::enum(ReferralType::class)],
            'refferalCode' => ['nullable', 'string', Rule::exists('users', 'referral_code')],
            'code' => ['required', 'string', 'min:5', 'max:5', new ValidOtp($this->email)]
        ];
    }


    /**
     *  registration attributes
     */
    public function registerAttribute(): array
    {
        return collect($this->validated())->except('code', 'refferalType', 'refferalCode')->merge([
            'clipper_uid' => Str::uuid()->toString()
        ])->toArray();
    }
}
