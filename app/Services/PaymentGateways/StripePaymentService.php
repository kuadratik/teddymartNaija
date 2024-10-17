<?php

namespace App\Services\Gateways;

use App\Contracts\PaymentGatewayInterface;

class StripePaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string $secretKey)
    {
        //
    }

    public function initialize(array $data): array
    {
        return [];
    }

    public function verify(string $reference): array
    {
        return [];
    }

    public function refund(string $reference, float $amount): array
    {
        return [];
    }
}
