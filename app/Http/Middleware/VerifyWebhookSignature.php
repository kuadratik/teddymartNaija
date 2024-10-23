<?php

namespace App\Http\Middleware;

use App\Enums\PaymentGatewayEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class VerifyWebhookSignature
{
    public function handle(Request $request, Closure $next, string $gateway)
    {

        $gateway = PaymentGatewayEnum::from($gateway);

        match ($gateway) {
            PaymentGatewayEnum::PAYPAL => $this->verifyPayPalSignature($request),
            PaymentGatewayEnum::STRIPE => $this->verifyStripeSignature($request),
            PaymentGatewayEnum::PAYSTACK => $this->verifyPaystackSignature($request),
        };

        return $next($request);
    }

    private function verifyPayPalSignature(Request $request): void
    {
        $webhookId = config('services.paypal.webhook_id');

        $transmissionId = $request->header('PAYPAL-TRANSMISSION-ID');
        $transmissionTime = $request->header('PAYPAL-TRANSMISSION-TIME');
        $certUrl = $request->header('PAYPAL-CERT-URL');
        $authAlgo = $request->header('PAYPAL-AUTH-ALGO');
        $transmissionSig = $request->header('PAYPAL-TRANSMISSION-SIG');

        Log::info('PayPal webhook headers', [
            'transmission_id' => $transmissionId,
            'transmission_time' => $transmissionTime,
            'cert_url' => $certUrl,
            'auth_algo' => $authAlgo
        ]);

        if (!$transmissionId || !$transmissionTime || !$certUrl || !$authAlgo || !$transmissionSig) {
            Log::error('Missing required PayPal headers');
            throw new AccessDeniedHttpException('Missing required PayPal headers');
        }


        $rawBody = $request->getContent();


        $crc32 = hexdec(hash('crc32b', $rawBody));

        $message = "{$transmissionId}|{$transmissionTime}|{$webhookId}|{$crc32}";

        $certContent = $this->getCachedPayPalCertificate($certUrl);

        $signatureBuffer = base64_decode($transmissionSig);
        $verify = openssl_verify(
            $message,
            $signatureBuffer,
            $certContent,
            OPENSSL_ALGO_SHA256
        );

        if ($verify !== 1) {
            Log::error('Invalid PayPal signature', [
                'verify_result' => $verify
            ]);
            throw new AccessDeniedHttpException('Invalid PayPal signature');
        }
        Log::info('PayPal signature verified successfully');
    }

    private function getCachedPayPalCertificate(string $certUrl): string
    {
        $cacheKey = 'paypal_cert_' . md5($certUrl);

        Log::info('Fetching PayPal certificate', [
            'cert_url' => $certUrl,
            'cache_key' => $cacheKey
        ]);

        return Cache::remember($cacheKey, now()->addDays(1), function () use ($certUrl) {
            $response = Http::get($certUrl);

            if (!$response->successful()) {
                Log::error('Failed to fetch PayPal certificate', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new AccessDeniedHttpException('Failed to fetch PayPal certificate');
            }
            Log::info('PayPal certificate fetched and cached successfully');

            return $response->body();
        });
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
