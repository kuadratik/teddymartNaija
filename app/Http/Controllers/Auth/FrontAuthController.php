<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;

class FrontAuthController extends Controller
{
    /**
     * User registration
     */
    public function register(RegisterRequest $request)
    {

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
