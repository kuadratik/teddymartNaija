<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListingPromotePlan;
use App\Models\Order;
use App\Models\StorePromotePlanStore;
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
                "return_url" => $data['return_url'] ?? route('payment.success'),
                "cancel_url" => $data['cancel_url'] ?? route('payment.cancel'),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => $data['currency_code'],
                        "value" => $data['total_amount']
                    ],
                    "custom_id" => json_encode([
                        'order_number' => $data['order_number'],
                        'type' => $data['type'] ?? PaymentType::CHECKOUT->value,
                    ]),
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {

            foreach ($response['links'] as $links) {
                if ($links['rel'] == 'approve') {
                    return ['url' => $links['href']];
                }
            }
        } else {
            log::error('paypal initialization error', $response);
            abort(500, 'Something went wrong');
        }
    }

    public function verify(array $data): array
    {
        try {
            $order = $this->provider->capturePaymentOrder($data['token']);

            if (!isset($order['status'])) {
                return $this->handleApiFailure($order);
            }

            if (isset($order['success']) && $order['success'] === false) {
                return $this->handleAlreadyCapturedOrder($order);
            }

            if (!$this->isOrderCompleted($order)) {
                return $this->handleIncompleteOrder($order);
            }

            return $this->processTransactionByType($order);
        } catch (\Exception $e) {
            return $this->handleVerificationException($e);
        }
    }

    private function isOrderCompleted(array $order): bool
    {
        return ($order['status'] === 'COMPLETED') ||
            ($order['status'] === 'APPROVED') ||
            (isset($order['status']['COMPLETED']) && $order['status']['COMPLETED']) ||
            (isset($order['status']['APPROVED']) && $order['status']['APPROVED']);
    }

    private function processTransactionByType(array $order): array
    {
        $transactionData = json_decode($order['purchase_units'][0]['custom_id'], true);
        $type = $transactionData['type'];

        return match ($type) {
            PaymentType::CHECKOUT->value => $this->handleCheckout($transactionData, $order),
            PaymentType::ADVERT->value => $this->handleAdvert($transactionData, $order),
            PaymentType::PROMOTION->value => $this->handlePromotion($transactionData, $order),
            default => $this->handleUnknownType($transactionData, $order)
        };
    }

    private function handleCheckout(array $transactionData, array $order): array
    {
        $order = Order::where([
            'order_number' => $transactionData['order_number'],
            'payment_status' => OrderStatusEnum::PENDING_PAYMENT
        ])->first();

        if ($order) {
            $order->update([
                'payment_status' => OrderStatusEnum::PENDING,
            ]);
        }

        return [$order];
    }

    private function handleAdvert(array $transactionData, array $order): array
    {
        $advert = AdvertListingPromotePlan::where([
            'order_number' => $transactionData['order_number'],
            'status' => OrderStatusEnum::PENDING_PAYMENT
        ])->first();

        if ($advert) {
            $advert->update([
                'status' => OrderStatusEnum::PENDING,
            ]);
        }

        return [$advert];
    }

    private function handlePromotion(array $transactionData, array $order): array
    {
        $promotion = StorePromotePlanStore::where([
            'order_number' => $transactionData['order_number'],
            'status' => OrderStatusEnum::PENDING_PAYMENT
        ])->first();

        if ($promotion) {
            $promotion->update([
                'status' => OrderStatusEnum::PENDING,
            ]);
        }

        return [$promotion];
    }

    private function handleUnknownType(array $transactionData, array $order): array
    {
        return [
            'status' => 'unknown_type',
            'message' => 'Unhandled payment type',
            'data' => $transactionData
        ];
    }

    private function handleApiFailure(array $order): array
    {
        return [
            'status' => 'error',
            'message' => 'Payment verification failed',
            'details' => $order['error']['details'] ?? 'Unknown error'
        ];
    }

    private function handleAlreadyCapturedOrder(array $order): array
    {
        return [
            'status' => 'already_captured',
            'message' => $order['message'] ?? 'Order already captured',
        ];
    }

    private function handleIncompleteOrder(array $order): array
    {
        return [
            'status' => 'incomplete',
            'message' => 'Payment not completed',
            'details' => $order
        ];
    }

    private function handleVerificationException(\Exception $e): array
    {
        return [
            'status' => 'error',
            'message' => 'Verification exception: ' . $e->getMessage()
        ];
    }


    public function refund(string $reference, float $amount): array
    {
        return [];
    }
}
