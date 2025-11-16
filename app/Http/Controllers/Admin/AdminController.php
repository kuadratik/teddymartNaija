<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Models\Admin;
use App\Services\Auth\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
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

    public function updateProfile(UpdateProfileRequest $request)
    {
        $request->user()->update($request->validated());
        return $this->success($request->user()->refresh());
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $request->user()->update([
            'password' => Hash::make($request->password)
        ]);

        return $this->success();
    }

    /**
     * Get the list of all admins
     */
    public function staff(Request $request)
    {
        $response = Admin::search($request->search)->paginate();
        return $this->success($response);
    }
}
