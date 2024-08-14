<?php

namespace App\Http\Controllers\Auth;

use App\Actions\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendVerifyOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FrontAuthController extends Controller
{
    /**
     * User registration
     */
    public function register(RegisterRequest $request, UserService $service)
    {
        $data = $request->registerAttribute();
        $service->register($data);
        return $this->success();
    }

    /**
     * verify email otp
     */
    public function verifyEmailOtp(VerifyOtpRequest $request, UserService $service)
    {
        $service->verifyEmail($request->validated('email'));
        return $this->success();
    }

    /**
     * Resend email otp
     */
    public function resendEmailOtp(ResendVerifyOtpRequest $request, UserService $service)
    {
        $service->resendEmailOtp($request->validated('email'));
        return $this->success();
    }

    /**
     * Login and federate user into our application
     */
    public function login(LoginRequest $request, UserService $service)
    {
        $login = $service->login($request->validated());
        return $this->success($login);
    }

    /**
     * social authentication
     */
    public function social() {}
}
