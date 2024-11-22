<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'admin' => 'App\Models\Admin',
            'user' => 'App\Models\User',
        ]);

        Broadcast::routes(["prefix" => "api", "middleware" => ["auth:sanctum"]]);
    }
}
