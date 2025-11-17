<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Requests\Admin\CreateStaffRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Models\Admin;
use App\Models\Permission;
use App\Notifications\Admin\StaffCreatedNotification;
use App\Services\Auth\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function __construct(protected AuthenticationService $authService)
    {
        //
    }

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
        $response = Admin::search($request->search)
            ->when($request->isBool('active'))->byActive($request->boolean('active'))
            ->when($request->filled('role'))->byRole($request->role)
            ->paginate();
        return $this->success($response);
    }

    /**
     * Return the list of permissions
     */
    public function permissions(Request $request)
    {
        $permissions = Permission::all();
        return $this->success($permissions);
    }

    /**
     * Create new staff user
     */
    public function createStaff(CreateStaffRequest $request)
    {
        $admin = Admin::create($request->validated());
        rescue(
            fn() => $admin->notify(new StaffCreatedNotification($request->password, $request->user()->first_name))
        );
        return $this->success($admin);
    }
}
