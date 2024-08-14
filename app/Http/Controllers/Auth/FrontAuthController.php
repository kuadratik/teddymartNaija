<?php

namespace App\Http\Controllers\Auth;

use App\Actions\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendVerifyOtpRequest;
use App\Http\Requests\Auth\ResetPasswordOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\Auth\AuthenticationService;

class FrontAuthController extends Controller
{
    /**
     * User registration
     */
    public function register(RegisterRequest $request, AuthenticationService $service)
    {
        $data = $request->validated();
        $service->sendOtpForRegistration($data);
        return $this->success();
    }

    /**
     * verify email otp
     */
    public function verifyEmailOtp(VerifyOtpRequest $request, AuthenticationService $service)
    {
        $service->verifyOtpAndCreateUser($request->registerAttribute());
        return $this->success();
    }

    /**
     * Resend email otp
     */
    public function resendEmailOtp(ResendVerifyOtpRequest $request, AuthenticationService $service)
    {
        $service->sendOtpForRegistration($request->validated());
        return $this->success();
    }

    /**
     * Login and federate user into our application
     */
    public function login(LoginRequest $request, AuthenticationService $service)
    {
        $login = $service->login($request->validated());
        return $this->success($login);
    }

    /**
     * send reset passsword otp
     */
    public function resetPasswordSendOtp(ResetPasswordOtpRequest $request, AuthenticationService $service)
    {
        $service->sendPasswordResetOtp($request->validated('email'));
        return $this->success();
    }

    /**
     * verify reset password otp
     */
    public function resetPassword(VerifyOtpRequest $request, AuthenticationService $service)
    {
        $service->resetPasswordWithOtp($request->validated());
        return $this->success();
    }
}
