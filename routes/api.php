<?php

use App\Http\Controllers\AdvertListingController;
use App\Http\Controllers\Auth\FrontAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Front\BusinessListingController;
use App\Http\Controllers\ListingsController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StoresController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WebhookController;
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
    Route::post('google-auth', [FrontAuthController::class, 'googleAuth']);
    Route::post('register', [FrontAuthController::class, 'register']);
    Route::post('register/verify', [FrontAuthController::class, 'verifyEmailOtp']);
    Route::post('register/otp-resend', [FrontAuthController::class, 'resendEmailOtp']);
    Route::post('reset/send-otp', [FrontAuthController::class, 'resetPasswordSendOtp']);
    Route::post('reset', [FrontAuthController::class, 'resetPassword']);
    Route::get('category', [GeneralController::class, 'getCategories']);
    Route::get('record-interaction/{category}', [GeneralController::class, 'recordUserInteraction']);
    Route::post('contact-us', [GeneralController::class, 'contactUs']);

    Route::middleware(['hasUid', 'optionalAuth'])->group(function () {
        Route::post('add-to-clip/{product:slug}', [UserController::class, 'addToClip']);
        Route::get('clips', [UserController::class, 'getClips']);
        Route::get('clip/{clip}', [UserController::class, 'viewClipItems']);
        Route::delete('clips/{clip}', [UserController::class, 'deleteClip']);
        Route::delete('delete-all-clip', [UserController::class, 'deleteAllClip']);
        Route::delete('clips/{clip}/items/{product:slug}', [UserController::class, 'deleteClipItem']);
    });

    Route::middleware(['hasSessionUid', 'optionalAuth'])->group(function () {
        Route::prefix('cart')->group(function () {
            Route::post('add/{product:slug}', [CartController::class, 'addToCart']);
            Route::post('/{product:slug}', [CartController::class, 'addToCart']);
            Route::put('edit/{product:slug}', [CartController::class, 'editCart']);
            Route::delete('remove/{product:slug}', [CartController::class, 'removeCartItem']);
            Route::delete('clear', [CartController::class, 'clearCart']);
            Route::get('/', [CartController::class, 'getCart']);
        });
    });

    Route::prefix('stores')->group(function () {
        Route::get('/', [StoresController::class, 'getStores']);
        Route::get('recommended-stores', [StoresController::class, 'getRecommendedStores']);
        Route::get('grouped-alpha-numeric', [StoresController::class, 'getStoresAlphaNumerically']);
        Route::get('popular-recommended-stores', [StoresController::class, 'getPopularRecommendedStores']);
        Route::post('{store}/add-view', [StoresController::class, 'addStoreViewsCount']);
        Route::get('{store}/listings', [StoresController::class, 'showStoreListing']);
        Route::get('{store}/listings/{listing}', [ListingsController::class, 'show']);
        Route::get('popular', [StoresController::class, 'getPopularStores']);
        Route::get('listing/popular', [ListingsController::class, 'getPopularListing']);
        Route::post('listings/{listing}/add-view', [ListingsController::class, 'addListingViewsCount']);
    });

    Route::prefix('listings')->group(function () {
        Route::get('/', [ListingsController::class, 'getListings']);
    });


    Route::prefix('advert')->group(function () {
        Route::get('plans', [AdvertListingController::class, 'getAdvertPlans']);
        Route::post('/gallery', [AdvertListingController::class, 'getAllAdverts']);
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
            Route::get('user-store/{userStore}/metrics', [StoresController::class, 'getUserStoreMetrics']);
            Route::patch('{userStore}/update', [StoresController::class, 'update']);
            Route::get('{userStore}/listings', [ListingsController::class, 'getUserStoreListings']);
            Route::post('{userStore}/listings/create', [ListingsController::class, 'create']);
        });

        Route::prefix('listings')->group(function () {
            Route::middleware('hasStore')->group(function () {
                Route::get('{userStore}/listing/{listing}', [ListingsController::class, 'showUserStoreListing']);
                Route::patch('{userStore}/listing/{listing}/set-availability', [ListingsController::class, 'setAvailability']);
                Route::patch('{userStore}/listing/{listing}/update', [ListingsController::class, 'update']);
                Route::delete('{userStore}/listing/{listing}/delete', [ListingsController::class, 'delete']);
            });
        });
    });

    Route::prefix('business-listings')->group(function () {
        Route::get('/', [BusinessListingController::class, 'index']);
        Route::post('create', [BusinessListingController::class, 'create']);
    });

    Route::prefix('front')->group(function () {
        Route::post('file-upload', [GeneralController::class, 'uploadTempFile']);
        Route::post('video-file-upload', [GeneralController::class, 'videoUploadTempFile']);
        Route::post('file-delete', [GeneralController::class, 'deleteTempFiles']);
        Route::post('clip/{clip}/order', [UserController::class, 'storeClipOrder']);
        Route::post('store/{store}/service/{listing}/order', [UserController::class, 'storeServiceEnquiry']);
        Route::post('clip/{order}/send-to-vendor', [UserController::class, 'sendOrderToVendor']);
        Route::post('cart/{cart}/payment', [PaymentController::class, 'payOrder']);
        Route::post('payment/{gateway}/verify', [PaymentController::class, 'verifyPayment']);
        Route::get('order', [CartController::class, 'getUserOrders']);

        Route::prefix('wishlist')->group(function () {
            Route::post('add/{product}', [CartController::class, 'addToWishlist']);
            Route::post('add-from-cart/{product}', [CartController::class, 'addToWishlistFromCart']);
            Route::get('/', [CartController::class, 'getUserWishlist']);
            Route::delete('remove/{product}', [CartController::class, 'removeFromWishlist']);
            Route::post('add-to-cart/{product}', [CartController::class, 'addWishlistToCart']);
        });

        Route::prefix('user')->group(function () {
            Route::get('profile', [UserController::class, 'getUserProfile']);
            Route::put('profile/update', [UserController::class, 'updateUserProfile']);
            Route::patch('change-password', [UserController::class, 'updateUserPassword']);
            Route::post('logout',  [FrontAuthController::class, 'logout']);
            Route::post('shipping-address/create', [CartController::class, 'storeShippingAddress']);
            Route::get('shipping-address', [UserController::class, 'savedShippingAddresses']);
            Route::post('clip/{clip}/order', [UserController::class, 'storeClipOrder']);
        });

        Route::prefix('advert')->group(function () {
            Route::post('create', [AdvertListingController::class, 'postAdvert']);
            Route::get('/', [AdvertListingController::class, 'getUserAdverts']);
        });
    });
});

Route::post('webhook/{gateway}', [WebhookController::class, 'handleWebhook'])
    ->middleware('verifyWebhookSignature:{gateway}');

Route::get('payment/success', [PaymentController::class, 'paypalSuccess'])->name('payment.success');
Route::get('payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

Route::prefix('console')->group(function () {});
