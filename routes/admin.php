<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\BrandCategoriesController;
use App\Http\Controllers\Admin\BrandController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);

        Route::prefix('brands')->group(function () {
            Route::get('/', [BrandController::class, 'index']);
            Route::post('/', [BrandController::class, 'store']);
            Route::get('/{brand}', [BrandController::class, 'show']);
            Route::put('/{brand}', [BrandController::class, 'update']);
            Route::delete('/{brand}', [BrandController::class, 'destroy']);
            Route::patch('/{brand}/archive', [BrandController::class, 'archive']);
            Route::patch('/{brand}/unarchive', [BrandController::class, 'unarchive']);



            Route::prefix('categories')->group(function () {
                Route::get('all', [BrandCategoriesController::class, 'index']);
                Route::post('/', [BrandCategoriesController::class, 'store']);
            });
        });
    });
});
