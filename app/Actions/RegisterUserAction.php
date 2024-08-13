<?php

namespace App\Actions;

use App\Models\User;

class RegisterUserAction
{
    /**
     * handles user registration process
     */
    public function handle(array $attr)
    {
        $user = User::create($attr);
        $this->sendOtpForEmailVerification();
        return $user;
    }


    /**
     * sends otp for email verification
     */
    private function sendOtpForEmailVerification() {}
}
