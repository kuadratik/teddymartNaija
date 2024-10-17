<?php

namespace App\Providers;

use App\Services\PaymentGateways\PaypalPaymentService;
use App\Services\PaymentGateways\StripePaymentService;
use  App\Services\PaymentGateways\PaymentService;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('payment.gateways', function ($app) {
            return [
                'stripe' => new StripePaymentService(config('services.stripe.secret')),
                'paypal' => new PaypalPaymentService(),
            ];
        });

        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService($app->make('payment.gateways'));
        });
    }
}
