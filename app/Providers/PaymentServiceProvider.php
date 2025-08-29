<?php

namespace App\Providers;

use App\Enums\PaymentGatewayEnum;
use App\Services\PaymentGateways\PaypalPaymentService;
use App\Services\PaymentGateways\StripePaymentService;
use  App\Services\PaymentGateways\PaymentService;
use App\Services\PaymentGateways\PaystackPaymentService;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        $this->app->singleton('payment.gateways', function ($app) {
            return [
                PaymentGatewayEnum::STRIPE->value => new StripePaymentService(config('services.stripe.secret_key')),
                PaymentGatewayEnum::PAYSTACK->value => new PaystackPaymentService(config('services.paystack.secret_key')),
                PaymentGatewayEnum::PAYPAL->value => resolve(PaypalPaymentService::class),
            ];
        });

        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService($app->make('payment.gateways'));
        });
    }
}
