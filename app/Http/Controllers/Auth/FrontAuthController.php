<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendVerifyOtpRequest;
use App\Http\Requests\Auth\ResetPasswordOtpRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\Auth\AuthenticationService;

class FrontAuthController extends Controller
{
    public function __construct(public AuthenticationService $authService)
    {
        //
    }

    /**
     * User registration
     */
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $this->authService->sendOtpForRegistration($data);
        return $this->success();
    }

    /**
     * verify email otp
     */
    public function verifyEmailOtp(VerifyOtpRequest $request)
    {
        $this->authService->verifyOtpAndCreateUser($request->registerAttribute());
        return $this->success();
    }

    /**
     * Resend email otp
     */
    public function resendEmailOtp(ResendVerifyOtpRequest $request)
    {
        $this->authService->sendOtpForRegistration($request->validated());
        return $this->success();
    }

    /**
     * Login and federate user into our application
     */
    public function login(LoginRequest $request)
    {
        $login = $this->authService->login($request->validated());
        return $this->success($login);
    }

    /**
     * send reset passsword otp
     */
    public function resetPasswordSendOtp(ResetPasswordOtpRequest $request)
    {
        $this->authService->sendPasswordResetOtp($request->validated('email'));
        return $this->success();
    }

    /**
     * verify reset password otp
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $this->authService->resetPasswordWithOtp($request->validated());
        return $this->success();
    }
}
