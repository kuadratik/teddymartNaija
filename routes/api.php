<?php

use App\Http\Controllers\Auth\FrontAuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\StoresController;
use App\Http\Controllers\UserController;
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
    Route::get('category/product', [CategoryController::class, 'getProductCategory']);
    Route::get('category/service', [CategoryController::class, 'getServiceCategory']);
    Route::get('category', [CategoryController::class, 'getAllCategory']);
});

Route::middleware('auth:api')->group(function () {

    Route::prefix('store')->controller(StoresController::class)->group(function () {
        Route::post('create', 'create');
        Route::get('user-store', 'showUserStore');
        Route::post('{userStore}/update', 'update');
        Route::post('file-upload', 'TempUploadFile');
    });

    Route::prefix('front')->group(function () {
        Route::post('logout', [FrontAuthController::class, 'logout']);
        Route::post('file-upload', [GeneralController::class], 'uploadTempFile');
        Route::prefix('user')->controller(UserController::class)->group(function () {
            Route::get('profile', 'getUserProfile');
            Route::put('profile/update', 'updateUserProfile');
            Route::patch('change-password', 'updateUserPassword');
        });
    });
});


Route::prefix('console')->group(function () {});
