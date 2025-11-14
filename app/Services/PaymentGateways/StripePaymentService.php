<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\GeneralEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListingPromotePlan;
use App\Models\Order;
use App\Models\Store;
use App\Models\StorePayoutDetail;
use App\Models\StorePromotePlanStore;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session as StripeSession;
use Stripe\PaymentIntent;
use Stripe\Stripe;


class StripePaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string|null $secretKey)
    {
        Stripe::setApiKey($secretKey);
    }

    public function initialize(array $data): array
    {
        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => $data['currency_code'],
                        'unit_amount' => $data['total_amount'] * 100,
                        'product_data' => [
                            'name' => $data['type'] ?? PaymentType::CHECKOUT->value . 'payment',
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
            "success_url" => $data['return_url'] ? "{$data['return_url']}?token={CHECKOUT_SESSION_ID}" : route('payment.success', ['token' => '{CHECKOUT_SESSION_ID}']),
            "cancel_url" => $data['cancel_url'] ? "{$data['return_url']}?token={CHECKOUT_SESSION_ID}" : route('payment.cancel', ['token' => '{CHECKOUT_SESSION_ID}']),
        ]);

        return [
            'authorization_url' => $session->url,
        ];
    }

    public function verify(array $data): array
    {
        if (!isset($data['token'])) {
            throw new \Exception("Stripe session ID missing.");
        }

        $sessionId = $data['token'];
        $session = StripeSession::retrieve($sessionId);

        $metadata = $session->toArray()['metadata'];
        $paymentIntent = PaymentIntent::retrieve($session->payment_intent)->toArray();
        $paymentIntent['metadata'] = $metadata;

        if ($paymentIntent['status'] !== 'succeeded') {
            return $this->handleFailedTransaction($paymentIntent);
        }

        return $this->processTransactionByType($paymentIntent);
    }

    /**
     * handle failed verification
     */
    private function handleVerificationFailure($response): array
    {
        $responseData = $response->json();

        return [
            'status' => 'error',
            'message' => $responseData['message'] ?? 'Failed to verify transaction',
            'code' => $responseData['code'] ?? null,
        ];
    }

    /**
     * handles payment transaction is failed
     */
    private function handleFailedTransaction(array $transactionData): array
    {
        $type = $transactionData['metadata']['type'];

        return match ($type) {
            PaymentType::VENDOR->value => $this->handleVendorPayment($transactionData),
            default => $this->handleUnknownType($transactionData)
        };
    }


    private function processTransactionByType(array $transactionData): array
    {
        $type = $transactionData['metadata']['type'];

        return match ($type) {
            PaymentType::CHECKOUT->value => $this->handleCheckoutPayment($transactionData),
            PaymentType::ADVERT->value => $this->handleAdvertPayment($transactionData),
            PaymentType::PROMOTION->value => $this->handlePromotionPayment($transactionData),
            PaymentType::VENDOR->value => $this->handleVendorPayment($transactionData),
            default => $this->handleUnknownType($transactionData)
        };
    }

    private function handleUnknownType(array $transactionData): array
    {
        return [
            'status' => 'unknown_type',
            'message' => 'Unhandled payment type',
            'data' => $transactionData
        ];
    }

    /**
     * Handle the vendor payment
     */
    private function handleVendorPayment(array $transactionData): array
    {
        $store = Store::where('order_number', $transactionData['metadata']['order_number'])->first();

        if ($store->payment_status !== GeneralEnum::SUCCESS->value) {
            $store->update([
                'fee_paid_at' => $transactionData['status'] === 'succeeded' ? now() : null,
                'payment_status' => $transactionData['status'] === 'succeeded' ? GeneralEnum::SUCCESS->value : GeneralEnum::FAILED->value
            ]);

            $store->feeHistory()->update([
                'status' => $transactionData['status'] === 'succeeded' ? GeneralEnum::SUCCESS : GeneralEnum::FAILED
            ]);
        }

        return [$transactionData];
    }

    /**
     * Handle if payment type is checkout
     */
    private function handleCheckoutPayment(array $transactionData): array
    {
        $orders = Order::where('order_number', $transactionData['metadata']['order_number'])->get();
        $mergedOrderDetails = [];
        if ($orders->isNotEmpty()) {
            foreach ($orders as $order) {

                if ($order->payment_status == OrderStatusEnum::PENDING_PAYMENT->value && !OrderStatusEnum::COMPLETED_PAYMENT->value) {
                    $order->update(['payment_status' => $transactionData['status']]);
                }

                $orderDetails = $order->load(['orderDetails.listing:id,name,price,weight', 'store']);

                $mergedOrderDetails[] = $orderDetails->toArray();
            }
        }

        return $mergedOrderDetails;
    }

    /**
     * Handle if payment type is advert
     */
    private function handleAdvertPayment(array $transactionData): array
    {
        $advert = AdvertListingPromotePlan::where([
            'order_number' => $transactionData['metadata']['order_number'],
            'status' => OrderStatusEnum::PENDING_PAYMENT,
        ])->first();

        if ($advert) {
            $advert->update([
                'status' => OrderStatusEnum::PENDING,
            ]);
        }

        return [$transactionData];
    }

    /**
     * Handle if payment type is promotion
     */
    private function handlePromotionPayment(array $transactionData): array
    {
        $promotion = StorePromotePlanStore::where([
            'order_number' => $transactionData['metadata']['order_number'],
            'status' => OrderStatusEnum::PENDING_PAYMENT,
        ])->first();

        if ($promotion) {
            $promotion->update([
                'status' => OrderStatusEnum::PENDING,
            ]);
        }

        return [$transactionData];
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
