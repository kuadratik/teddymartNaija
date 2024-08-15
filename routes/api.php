<?php

use App\Http\Controllers\Auth\FrontAuthController;
use App\Http\Controllers\StoresController;
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
    Route::post('register/verify', [FrontAuthController::class, 'verifyEmailOtp']);
    Route::post('register/otp-resend', [FrontAuthController::class, 'resendEmailOtp']);
    Route::post('reset/send-otp', [FrontAuthController::class, 'resetPasswordSendOtp']);
    Route::post('reset', [FrontAuthController::class, 'resetPassword']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('store')->controller(StoresController::class)->group(function () {
        Route::post('create', 'create');
        Route::get('user-store' ,'showUserStore');
        Route::post('{userStore}/update', 'update');
    });

});


Route::prefix('console')->group(function () {
});
