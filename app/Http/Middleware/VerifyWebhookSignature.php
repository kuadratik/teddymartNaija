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
            default => throw new AccessDeniedHttpException('Invalid payment gateway'),
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
        $secret = config('services.paystack.secret_key');
        $signature = $request->header('X-Paystack-Signature');
        $payload = $request->getContent();

        if ($signature !== hash_hmac('sha512', $payload, $secret)) {
            Log::warning('Paystack signature verification failed', ['signature' => $signature]);
            throw new AccessDeniedHttpException('Unauthorized');
        }

        Log::info('Paystack signature verified successfully');
    }
}
