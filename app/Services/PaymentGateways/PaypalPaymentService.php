<?php

namespace App\Services\Gateways;

use App\Contracts\PaymentGatewayInterface;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;

class PaypalPaymentService implements PaymentGatewayInterface
{

    public function __construct(private readonly string $clientId,  private readonly string $clientSecret)
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
