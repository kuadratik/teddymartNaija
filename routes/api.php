<?php

use App\Http\Controllers\Auth\FrontAuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ListingsController;
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
    Route::get('category', [GeneralController::class, 'getCategories']);

    Route::prefix('stores')->group(function () {
        Route::get('/', [StoresController::class, 'getStores']);
        Route::get('{store}/listings', [StoresController::class, 'showStoreListing']);
        Route::get('{store}/listings/{listing}', [ListingsController::class, 'show']);
    });
});

Route::middleware('auth:api')->group(function () {

    Route::prefix('store')->group(function () {
        Route::post('create', [StoresController::class, 'create']);
        Route::middleware('hasStore')->group(function () {
            Route::get('user-store', [StoresController::class, 'showUserStore']);
            Route::patch('{userStore}/update', [StoresController::class, 'update']);
        });

        Route::prefix('listings')->group(function () {

            Route::middleware('hasStore')->group(function () {
                Route::get('/', [ListingsController::class, 'getUserStoreListings']);
                Route::get('/total', [ListingsController::class, 'getUserStoreListingsCount']);
                Route::post('create', [ListingsController::class, 'create']);
                Route::get('{userStore}/listing/{listing}', [ListingsController::class, 'showUserStoreListing']);
                Route::patch('{userStore}/listing/{listing}/set-availability', [ListingsController::class, 'setAvailability']);
                Route::patch('{userStore}/listing/{listing}/update', [ListingsController::class, 'update']);
                Route::delete('{userStore}/listing/{listing}/delete', [ListingsController::class, 'delete']);
            });
        });
    });

    Route::prefix('front')->group(function () {

        Route::post('file-upload', [GeneralController::class, 'uploadTempFile']);
        Route::post('file-delete', [GeneralController::class, 'deleteTempFiles']);

        Route::prefix('user')->controller(UserController::class)->group(function () {
            Route::get('profile', 'getUserProfile');
            Route::put('profile/update', 'updateUserProfile');
            Route::patch('change-password', 'updateUserPassword');
            Route::post('logout',  'logout');
        });
    });
});


Route::prefix('console')->group(function () {
});
