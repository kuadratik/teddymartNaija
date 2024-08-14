<?php

namespace App\Actions;

use App\Models\User;
use App\Notifications\SendEmailVerificationOtp;
use Illuminate\Support\Str;

class RegisterUserAction
{
    /**
     * handles user registration process
     */
    public function handle(array $attr)
    {
        $user = User::create($attr);
        $this->sendOtpForEmailVerification($user);
        return $user;
    }


    /**
     * sends otp for email verification
     */
    private function sendOtpForEmailVerification(User $user)
    {
        $otp = mt_rand(10000, 99999);
        $user->notify(new SendEmailVerificationOtp($otp));
    }
}
