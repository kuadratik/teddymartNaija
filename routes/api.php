<?php

use App\Http\Controllers\Auth\FrontAuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ListingsController;
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
    Route::get('category/product', [CategoryController::class, 'getProductCategory']);
    Route::get('category/service', [CategoryController::class, 'getServiceCategory']);
    Route::get('category', [CategoryController::class, 'getAllCategory']);
});

Route::middleware('auth:api')->group(function () {

    Route::prefix('store')->group(function () {

        Route::post('create', [StoresController::class, 'create']);
        Route::get('user-store', [StoresController::class, 'showUserStore']);
        Route::patch('{userStore}/update', [StoresController::class, 'update']);
        Route::post('file-upload', [StoresController::class, 'uploadTempFile']);

        Route::prefix('listings')->group(function () {
            Route::get('/', [ListingsController::class, 'getUserStoreListings']);
            Route::post('create', [ListingsController::class, 'create']);
            Route::get('{userStore}/listing/{listing}', [ListingsController::class, 'show']);
            Route::patch('{userStore}/listing/{listing}/update', [ListingsController::class, 'update']);
            Route::delete('{userStore}/listing/{listing}/delete', [ListingsController::class, 'delete']);
        });
    });

    Route::prefix('front')->group(function () {
        Route::post('logout', [FrontAuthController::class, 'logout']);
    });
});


Route::prefix('console')->group(function () {
});
