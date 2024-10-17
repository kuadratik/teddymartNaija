<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalPaymentService implements PaymentGatewayInterface
{

    public function __construct()
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
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
