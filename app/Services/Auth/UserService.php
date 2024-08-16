<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Support\Utils;
use App\Http\Requests\User\UpdateUserRequest;


class UserService
{



    /**
     * update users password
     */
    public function updateUserPassword($request)
    {
        $user = User::find(auth('api')->user()->id);
        if (!password_verify($request['old_password'], $user->password)) {
            return Utils::validateResp(['new_password' => ['The provided old password is incorrect.']]);
        }
        $user->update(['password' => bcrypt($request['new_password'])]);
        return true;
    }
}
