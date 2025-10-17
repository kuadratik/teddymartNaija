<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Services\Auth\AuthenticationService;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function __construct(protected AuthenticationService $authService) {}

    public function login(AdminLoginRequest $request)
    {
        $result = $this->authService->adminLogin($request->email, $request->password);

        return $this->success($result);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->success(['message' => 'Logged out successfully']);
    }
}
