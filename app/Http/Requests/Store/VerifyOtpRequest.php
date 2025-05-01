<?php

namespace App\Http\Requests\Store;

use App\Rules\ValidOtp;
use Illuminate\Foundation\Http\FormRequest;

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
     */
    public function rules(): array
    {
        return [
            'otp' => ['required', new ValidOtp($this->user()->email)],
        ];
    }
}
