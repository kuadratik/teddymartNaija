<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use AWS\CRT\HTTP\Message;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackPaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string|null $secretKey)
    {
        //
    }

    public function initialize(array $data): array
    {
        $response = Http::withToken($this->secretKey)->post(config('services.paystack.payment_url') . '/transaction/initialize', [
            'email' => $data['email'],
            'amount' => $data['total_amount'] * 100,
            "currency" => $data['currency_code'],
            'metadata' => [
                'order_number' => $data['order_number'],
            ],
        ]);

        if ($response->successful()) {
            return ['url' => $response['data']['authorization_url']];
        }

        Log::error('paypal initialization error', $response);
        abort(500, 'Something went wrong');
    }


    public function verify(array $data): array
    {
        return [];
    }

    public function refund(string $reference, float $amount): array
    {
        return [];
    }
}
