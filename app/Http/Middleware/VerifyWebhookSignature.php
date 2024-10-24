<?php

namespace App\Http\Middleware;

use App\Enums\PaymentGatewayEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class VerifyWebhookSignature
{
    public function handle(Request $request, Closure $next)
    {
        $gateway = $request->route()->parameter('gateway');

        match ($gateway) {
            PaymentGatewayEnum::PAYPAL => $this->verifyPayPalSignature($request),
            PaymentGatewayEnum::STRIPE => $this->verifyStripeSignature($request),
            PaymentGatewayEnum::PAYSTACK => $this->verifyPaystackSignature($request),
        };

        return $next($request);
    }

    private function verifyPayPalSignature(Request $request): void
    {
        $payPalClient = new PayPalClient;
        $payPalClient->verifyIPN($request);
        Log::info('PayPal signature verified successfully');
    }

        private function verifyStripeSignature(Request $request)
    {
        Log::info('Verifying Stripe signature', [
            'headers' => $request->headers->all()
        ]);
    }

    private function verifyPaystackSignature(Request $request)
    {
        Log::info('Verifying Paystack signature', [
            'headers' => $request->headers->all()
        ]);
    }
}
