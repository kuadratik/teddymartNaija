<?php

namespace App\Rules;

use Closure;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Hash;

class ValidOtp implements ValidationRule
{

    /**
     * Create a new rule instance.
     *
     * @param string $email
     */
    public function __construct(protected $email)
    {
        //
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::where('email', $this->email)->first();

        if (!$user) {
            $fail('No user found with this email.');
            return;
        }

        $otpRecord = Otp::where('user_id', $user->id)->first();

        if (!$otpRecord) {
            $fail('The provided OTP is invalid.');
            return;
        }

        if (!Hash::check($value, $otpRecord->otp)) {
            $fail('The provided OTP is invalid.');
            return;
        }

        if ($otpRecord->expires_at->isPast()) {
            $fail('The OTP has expired.');
            return;
        }

        if ($otpRecord->is_used) {
            $fail('The OTP has already been used.');
            return;
        }
    }
}
