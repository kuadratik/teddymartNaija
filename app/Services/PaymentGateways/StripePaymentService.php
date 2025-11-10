<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\PaymentType;
use App\Models\Order;
use App\Models\StorePayoutDetail;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;


class StripePaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string|null $secretKey)
    {
        Stripe::setApiKey(config('services.stripe.secret_key'));
    }

    public function initialize(array $data): array
    {        
        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'cad',
                        'unit_amount' => $data['total_amount'] * 100,
                        'product_data' => [
                            'name' =>  $data['type'] ?? PaymentType::CHECKOUT->value . 'payment',
                        ],
                    ],
                    'quantity' => 1,
                ]
            ],
            'metadata' => [
                'order_number' => $data['order_number'],
                'type' => $data['type'] ?? PaymentType::CHECKOUT->value,
            ],
            'mode' => 'payment',
            "success_url" => $data['return_url'] ?? route('payment.success', ['status' => 'success']),
            "cancel_url" => $data['cancel_url'] ?? route('payment.cancel', ['status' => 'cancel']),
        ]);

        return [
            'authorization_url' => $session->url,
        ];
    }

    public function verify(array $data): array
    {
        return [];
    }

    public function refund(string $reference, float $amount): array
    {
        return [];
    }

    public function transfer(Order $order, StorePayoutDetail $payoutDetail): array
    {
        return [];
    }

    public function validateBankDetails(string $accountNumber, string $bankCode): array
    {
        return [];
    }
    
    public function createTransferRecipient(string $accountName, string $accountNumber, string $bankCode): array
    {
        return [];
    }

    public function acceptedBanks(?string $search = null, ?string $next = null, ?string $prev = null, int $perPage = 100): array
    {
        return [];
    }
}
