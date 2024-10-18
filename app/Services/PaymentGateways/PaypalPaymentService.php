<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Services\CartService;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalPaymentService implements PaymentGatewayInterface
{

    protected $provider;
    protected $accessToken;
    protected $cartService;

    public function __construct()
    {
        $this->provider = new PayPalClient;
        $this->provider->setApiCredentials(config('paypal'));
        $this->accessToken =  $this->provider->getAccessToken();
        $this->cartService = new CartService;
    }

    public function initialize(array $data): array
    {

        $response = $this->provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => '#',
                "cancel_url" => '#',
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => $data['formData']['currency_code'],
                        "value" => $data['amount']
                    ]
                ]
            ]
        ]);
        return $response;
    }


    public function verify(array $data): array
    {
        $response = $this->provider->capturePaymentOrder($data['token']);
        if (isset($response['status']) & $response['status'] == 'COMPLETED') {
            $res = $this->cartService->createCartOrder($data);
            return ['message' => 'transaction successfull'];
        } else {
            abort(400, 'Payment failed');
        }
    }

    public function refund(string $reference, float $amount): array
    {
        return [];
    }
}
