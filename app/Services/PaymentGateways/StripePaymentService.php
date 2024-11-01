<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;

class StripePaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string|null $secretKey)
    {
        //
    }

    public function initialize(array $data): array
    {
        return [];
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
