<?php

namespace App\Services\Auth;

use App\Models\Otp;
use App\Models\User;
use App\Notifications\OnboardingUserNotification;
use App\Notifications\SendEmailVerificationOtp;
use App\Notifications\ResetPasswordNotification;
use App\Support\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthenticationService
{
    /**
     * Send OTP for email verification.
     */
    public function sendOtpForRegistration(array $data): object
    {
        $otp = random_int(10000, 99999);

        $data = (object) $data;

        Notification::route('mail', $data->email)->notify(new SendEmailVerificationOtp($otp, $data));

        return $data;
    }

    /**
     * Verify OTP and create the user after verification.
     */
    public function verifyOtpAndCreateUser(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $otpRecord = Otp::where('email', $data['email'])->firstOrFail();
            $user = User::create($data);
            $user->markEmailAsVerified();

            $otpRecord->delete();

            $user->notify(new OnboardingUserNotification());

            return [
                'token' => $user->createToken('authToken')->plainTextToken,
                'user' => $user->load('store'),
            ];
        });
    }

    /**
     * Login user and send token, handle authentication failure with a validation error.
     */
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (!Hash::check($data['password'], optional($user)->password)) {
            return Utils::validateResp(['email' => ['The provided credentials are invalid.']]);
        }
        return [
            'token' => $user->createToken('authToken')->plainTextToken,
            'user' => $user->load('store'),
        ];
    }
    /**
     * Verify gogle token and create or login account
     */
    public function loginOrRegisterWithGoogle(string $token): array
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($token);
        } catch (\Exception $e) {
            Log::error('Google authenticaion failed', [$e]);
            abort($e->getCode(), 'Google authenticaion failed');
        }

        $user = User::firstOrNew(['email' => $googleUser->getEmail()], [
            'first_name' => explode(' ', $googleUser->getName())[0],
            'last_name' => implode(' ', array_slice(explode(' ', $googleUser->getName()), 1)),
            'google_id' => $googleUser->getId(),
            'password' => bcrypt(Str::random(16)),
        ]);

        if (!$user->exists || empty($user->google_id)) {
            $user->google_id = $googleUser->getId();
            $user->save();
        }

        $token = $user->createToken('Google OAuth')->plainTextToken;

        return [
            'user' => $user->fresh(),
            'token' => $token,
        ];
    }

    /**
     * send password reset otp
     */
    public function sendPasswordResetOtp(string $email): bool
    {
        $user = User::where('email', $email)->firstOrFail();
        $otp = random_int(10000, 99999);
        $user->notify(new ResetPasswordNotification($otp));
        return true;
    }

    /**
     * reset password with otp
     */
    public function resetPasswordWithOtp(array $data): bool
    {
        return DB::transaction(function () use ($data) {
            $otpRecord = Otp::where('email', $data['email'])->firstOrFail();
            $user = User::where('email', $data['email'])->firstOrFail();
            $user->update(['password' => bcrypt($data['new_password'])]);
            $otpRecord->delete();
            return true;
        });
    }

    /**
     * logout user
     */
    public function logout(): bool
    {
        auth()->user()->currentAccessToken()->delete();
        return true;
    }
}
