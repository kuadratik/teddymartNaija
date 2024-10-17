<?php

namespace App\Providers;

use App\Contracts\PaymentGatewayInterface;
use App\Services\Gateways\PaypalPaymentService;
use App\Services\Gateways\StripePaymentService;
use App\Services\PaymentService;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('payment.gateways', function ($app) {
            return [
                'stripe' => new StripePaymentService(config('services.stripe.secret')),
                'paypal' => new PaypalPaymentService(config('services.paypal.client_id'), config('services.paypal.client_secret')),
            ];
        });

        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService($app->make('payment.gateways'));
        });
    }
}
