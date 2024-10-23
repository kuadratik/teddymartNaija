<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\PaymentGatewayEnum;
use App\Services\CartService;
use Illuminate\Support\Facades\Log;
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
                "return_url" => route('payment.success'),
                "cancel_url" => route('payment.cancel'),
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

        if (isset($response['id']) && $response['id'] != null) {

            foreach ($response['links'] as $links) {
                if ($links['rel'] == 'approve') {
                    return ['url' => $links['href']];
                }
            }
        }else{
            log::error('paypal initialization error', $response);
            abort(500, 'Something went wrong');
        }
    }

    /**
     * Verifies a payment order by capturing the payment using the provided token.
     */
    public function verify(array $data): array
    {
        $order = $this->provider->capturePaymentOrder($data['token']);

        $response = [
            'reference_id' => $order['id'],
            'amount' => $order['purchase_units']['amount']['value'],
            'currency' => $order['purchase_units']['amount']['currency_code'],
            'status' => $order['status'],
            'gateway' => PaymentGatewayEnum::PAYPAL->value,
            'response' => $order
        ];

        if (isset($response['status'])) {
            $res = $this->cartService->createCartOrder($data, $response);
            return ['message' => 'transaction successfull'];
        }
    }

    public function refund(string $reference, float $amount): array
    {
        return [];
    }
}
