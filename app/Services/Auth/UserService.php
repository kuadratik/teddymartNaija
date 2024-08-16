<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Support\Utils;

class UserService
{

    public function updateUserPassword($request)
    {
        $user = User::find(auth('api')->user()->id);
        if (!password_verify($request['old_password'], $user->password)) {
            return Utils::validateResp(['password' => ['The provided old password is incorrect.']]);
        }
        $user->update(['password' => bcrypt($request['password'])]);
    }
}
