<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;

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

        Model::preventSilentlyDiscardingAttributes(env('APP_ENV') == 'local');

        Route::macro('stopper', function ($key) {
            return Route::middleware("stopper:$key");
        });

        $timeout = 60;
        
        Http::macro('paystack', function () use ($timeout) {
            return Http::acceptJson()->asJson()->timeout($timeout)
                ->withToken(config('paystack.secretKey'))
                ->baseUrl(config('services.paystack.payment_url'));
        });

         Request::macro('isBool', function (string $key): bool {
            if (!$this->has($key)) {
                return false;
            }

            $value = $this->input($key);

            $validBools = ['0', '1', 'true', 'false', true, false];

            return in_array($value, $validBools, true);
        });
    }
}
