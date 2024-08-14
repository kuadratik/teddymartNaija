<?php

use App\Http\Controllers\Auth\FrontAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('front')->group(function () {
    Route::post('login', [FrontAuthController::class, 'login']);
    Route::post('register', [FrontAuthController::class, 'register']);
    Route::post('otp/verify', [FrontAuthController::class, 'verifyEmailOtp']);
    Route::post('otp/resend', [FrontAuthController::class, 'resendEmailOtp']);
    Route::post('social', [FrontAuthController::class, 'social']);
});


Route::prefix('console')->group(function () {
});

