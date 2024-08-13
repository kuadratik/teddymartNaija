<?php

namespace App\Http\Controllers\Auth;

use App\Actions\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;

class FrontAuthController extends Controller
{
    /**
     * User registration
     */
    public function register(RegisterRequest $request, RegisterUserAction $action)
    {
        $data = $request->registerAttribute();
        $action->handle($data);
        return $this->success();
    }

    /**
     * Login and federate user into our application
     */
    public function login(LoginRequest $request)
    {

    }

    /**
     * social authentication
     */
    public function social()
    {

    }
}
