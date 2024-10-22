<?php

namespace App\Http\Middleware;

use App\Enums\PaymentGatewayEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
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

        if (!$transmissionId || !$transmissionTime || !$certUrl || !$authAlgo || !$transmissionSig) {
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
            throw new AccessDeniedHttpException('Invalid PayPal signature');
        }
    }

    private function getCachedPayPalCertificate(string $certUrl): string
    {
        $cacheKey = 'paypal_cert_' . md5($certUrl);

        return Cache::remember($cacheKey, now()->addDays(1), function () use ($certUrl) {
            $response = Http::get($certUrl);

            if (!$response->successful()) {
                throw new AccessDeniedHttpException('Failed to fetch PayPal certificate');
            }

            return $response->body();
        });
    }



    private function verifyStripeSignature(Request $request)
    {
        //
    }

    private function verifyPaystackSignature(Request $request)
    {
       //
    }
}
