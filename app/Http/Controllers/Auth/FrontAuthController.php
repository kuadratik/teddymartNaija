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
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

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
        $data = collect($request->validated())->only('first_name', 'last_name', 'email', 'password')->toArray();
        $response = $this->authService->createUser($data);
        return $this->success($response);
    }

    /**
     * login or register user with google
     */
    public function googleAuth(Request $request)
    {
        $request->validate(['token' => 'required']);
        $user = $this->authService->loginOrRegisterWithGoogle($request->token);
        return $this->success($user);
    }

    /**
     * verify email otp
     */
    public function verifyEmailOtp(VerifyOtpRequest $request)
    {
        $response = $this->authService->verifyOtpAndCreateUser($request->registerAttribute(), $request->validated('refferalCode'), $request->validated('refferalType'));
        return $this->success($response);
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

    /**
     * Password verification for auth user
     */
    public function authConfirmation(Request $request)
    {
        $request->validate(['password' => 'required']);
        $this->authService->authConfirmation($request->password);

        return $this->success();
    }

    /**
     * logout user
     */
    public function logout()
    {
        $this->authService->logout();
        return $this->success();
    }
}
