<?php

namespace App\Services\Auth;

use App\Models\Otp;
use App\Models\User;
use App\Notifications\SendEmailVerificationOtp;
use App\Notifications\ResetPasswordNotification;
use App\Support\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

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
    public function verifyOtpAndCreateUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $otpRecord = Otp::where('email', $data['email'])->firstOrFail();
            $user = User::create($data);

            $user->markEmailAsVerified();

            $otpRecord->delete();

            return $user;
        });
    }

    /**
     * Login user and send token, handle authentication failure with a validation error.
     */
    public function login(array $data): array
    {
        $uid = request()->header('Clip-Uid');
        $user = User::where('email', $data['email'])->first();

        if (!Hash::check($data['password'], optional($user)->password)) {
            return Utils::validateResp(['email' => ['The provided credentials are invalid.']]);
        }

        $user->when($uid, function ($query) use ($data, $uid) {
            $query->updateOrCreate(
                ['email' => $data['email']],
                ['clipper_uid' => $uid]
            );
        });

        return [
            'token' => $user->createToken('authToken')->plainTextToken,
            'user' => $user->load('store'),
            'clipper_uid' => @$uid,
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
