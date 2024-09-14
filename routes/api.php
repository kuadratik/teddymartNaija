<?php

use App\Http\Controllers\Auth\FrontAuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Common\CountryController;
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
    Route::get('record-interaction/{category}', [GeneralController::class, 'recordUserInteraction']);

    Route::middleware(['hasUid', 'optionalAuth'])->group(function () {
        Route::post('add-to-clip/{product:slug}', [UserController::class, 'addToClip']);
        Route::get('clips', [UserController::class, 'getClips']);
        Route::get('clip/{clip}', [UserController::class, 'viewClipItems']);
        Route::delete('clips/{clip}', [UserController::class, 'deleteClip']);
        Route::delete('clips/{clip}/items/{product:slug}', [UserController::class, 'deleteClipItem']);
    });

    Route::prefix('stores')->group(function () {
        Route::get('/', [StoresController::class, 'getStores']);
        Route::get('recommended-stores', [StoresController::class, 'getRecommendedStores']);
        Route::get('popular-stores', [StoresController::class, 'getPopularStores']);
        Route::post('{store}/add-view', [StoresController::class, 'addStoreViewsCount']);
        Route::get('{store}/listings', [StoresController::class, 'showStoreListing']);
        Route::get('{store}/listings/{listing}', [ListingsController::class, 'show']);
        Route::post('listings/{listing}/add-view', [ListingsController::class, 'addListingViewsCount']);

    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('location')->group(function () {
        Route::get('countries', [GeneralController::class, 'countries']);
        Route::get('countries/{country}/divisions', [GeneralController::class, 'countryDivision']);
    });

    Route::prefix('store')->group(function () {
        Route::post('create', [StoresController::class, 'create']);
        Route::middleware('hasStore')->group(function () {
            Route::get('user-store', [StoresController::class, 'showUserStore']);
            Route::get('user-store/metrics', [StoresController::class, 'getUserStoreMetrics']);
            Route::patch('{userStore}/update', [StoresController::class, 'update']);
        });

        Route::prefix('listings')->group(function () {
            Route::middleware('hasStore')->group(function () {
                Route::get('/', [ListingsController::class, 'getUserStoreListings']);
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
        Route::post('clip/{clip}/order', [UserController::class, 'storeClipOrder']);
        Route::post('clip/{order}/send-to-vendor', [UserController::class, 'sendOrderToVendor']);
        Route::prefix('user')->group(function () {
            Route::get('profile', [UserController::class, 'getUserProfile']);
            Route::put('profile/update', [UserController::class, 'updateUserProfile']);
            Route::patch('change-password', [UserController::class, 'updateUserPassword']);
            Route::post('logout',  [FrontAuthController::class, 'logout']);
        });
    });
});


Route::prefix('console')->group(function () {});
