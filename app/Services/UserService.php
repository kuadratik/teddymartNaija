<?php

namespace App\Services;

use App\Models\Otp;
use App\Models\User;
use App\Notifications\SendEmailVerificationOtp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserService
{

    /**
     * register a new User
     */
    public function register(array $data): User
    {
        $user = User::create($data);
        $this->sendOtpForEmailVerification($user);
        return $user;
    }

    /**
     * sends otp for email verification
     */
    private function sendOtpForEmailVerification(User $user)
    {
        $otp = random_int(10000, 99999);
        $user->notify(new SendEmailVerificationOtp($otp));
    }

    /**
     * Verify email and delete the OTP after verification.
     */
    public function verifyEmail(string $email): User
    {
        $user = User::where('email', $email)->firstOrFail();
        $user->markEmailAsVerified();
        Otp::where('user_id', $user->id)->delete();
        return $user;
    }

    /**
     * resend otp for email verification
     */
    public function resendEmailOtp(string $email)
    {
        $user = User::where('email', $email)->firstOrFail();
        $this->sendOtpForEmailVerification($user);
    }

    /**
     * Login user and send token, handle authentication failure with a validation error.
     */
    public function login(array $data)
    {
        if (!Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        $token = auth()->user()->createToken('authToken')->plainTextToken;
        return ['token' => $token];
    }
}
