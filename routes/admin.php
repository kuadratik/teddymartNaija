<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminStoreController;
use App\Http\Controllers\Admin\BrandCategoriesController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\BrandHistoryNoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);

        Route::patch('stores/{store}/deactivate', [AdminStoreController::class, 'deactivate']);
        Route::patch('stores/{store}/activate', [AdminStoreController::class, 'activate']);

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
