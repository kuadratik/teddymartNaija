<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminStoreController;
use App\Http\Controllers\Admin\BrandCategoriesController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\BrandHistoryNoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('logout', [AdminController::class, 'logout']);
        Route::post('profile-update', [AdminController::class, 'updateProfile']);
        Route::post('password-update', [AdminController::class, 'updatePassword']);
        Route::get('staff', [AdminController::class, 'staff']);
        Route::get('staff/{admin}/details', [AdminController::class, 'staffDetails']);
        Route::post('staff/create', [AdminController::class, 'createStaff']);
        Route::put('staff/{admin}/update', [AdminController::class, 'updateStaff']);
        Route::delete('staff/{admin}/delete', [AdminController::class, 'deleteStaff']);
        Route::get('permissions', [AdminController::class, 'permissions']);

        Route::patch('stores/{store}/deactivate', [AdminStoreController::class, 'deactivate']);
        Route::patch('stores/{store}/activate', [AdminStoreController::class, 'activate']);
        Route::get('stores', [AdminStoreController::class, 'vendors']);

        Route::prefix('navigations')->group(function () {
            Route::get('/', [AdminStoreController::class, 'navigations']);
            Route::post('create', [AdminStoreController::class, 'createMenu']);
            Route::put('{navigation}/update', [AdminStoreController::class, 'updateMenu']);
            Route::delete('{navigation}/delete', [AdminStoreController::class, 'deleteMenu']);
        });

        Route::prefix('brands')->group(function () {
            Route::get('/', [BrandController::class, 'index']);
            Route::post('/', [BrandController::class, 'store']);
            Route::post('/slug-recommendation', [BrandController::class, 'slugRecommendation']);
            Route::get('/{brand}', [BrandController::class, 'show']);
            Route::put('/{brand}', [BrandController::class, 'update']);
            Route::delete('/{brand}', [BrandController::class, 'destroy']);
            Route::patch('/{brand}/archive', [BrandController::class, 'archive']);
            Route::patch('/{brand}/unarchive', [BrandController::class, 'unarchive']);

            Route::prefix('categories')->group(function () {
                Route::get('all', [BrandCategoriesController::class, 'index']);
                Route::post('/', [BrandCategoriesController::class, 'store']);
            });

            Route::get('history/all', [BrandController::class, 'history']);
            Route::patch('history/{brandHistory}/note', [BrandController::class, 'updateHistoryNote']);

            Route::prefix('history-notes')->group(function () {
                Route::get('/all', [BrandHistoryNoteController::class, 'list']);
                Route::post('/', [BrandHistoryNoteController::class, 'create']);
                Route::get('/{id}', [BrandHistoryNoteController::class, 'show']);
                Route::put('/{id}', [BrandHistoryNoteController::class, 'update']);
                Route::delete('/{id}', [BrandHistoryNoteController::class, 'delete']);
            });
        });
    });
});
