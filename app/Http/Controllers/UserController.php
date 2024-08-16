<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdateUserPasswordRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\Auth\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function __construct(public UserService $userService)
    {
        //
    }

    /**
     * get users profile details
     */
    public function getUserProfile()
    {
        $user = auth('api')->user();
        return  $this->success($user);
    }

    /**
     * update users profile
     */
    public function updateUserProfile(UpdateUserRequest $request)
    {
        User::where('id', auth('api')->user()->id)->update($request->validated());
        return $this->success();
    }

    /**
     * update users password
     */
    public function updateUserPassword(UpdateUserPasswordRequest $request)
    {
        $this->userService->updateUserPassword($request->validated());
        return $this->success();
    }
}
