<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListingPromotePlan;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\StorePromotePlanStore;
use AWS\CRT\HTTP\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackPaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string|null $secretKey)
    {
        //
    }

    /**
     * initialize paystack payment
     */
    public function initialize(array $data): array
    {
        $response = Http::withToken($this->secretKey)->post(config('services.paystack.payment_url') . '/transaction/initialize', [
            'email' => $data['email'] ?? Auth::user()->email,
            'amount' => $data['total_amount'] * 100,
            "currency" => $data['currency_code'],
            "callback_url" => $data['return_url'] ?? route('payment.success'),
            'metadata' => [
                'order_number' => $data['order_number'],
                'type' => $data['type'] ?? PaymentType::CHECKOUT->value,
                "cancel_url" => $data['cancel_url'] ?? route('payment.cancel'),
            ],
        ]);

        if ($response->successful()) {
            return ['url' => $response['data']['authorization_url']];
        }

        Log::error('paypal initialization error', [$response]);
        abort(500, 'Something went wrong');
    }

    /**
     * verify paystack payment
     */
    public function verify(array $data): array
    {
        $token = $data['token'];


        $response = $this->verifyPaystackTransaction($token);

        if (!$response->successful()) {
            return $this->handleVerificationFailure($response);
        }

        $responseData = $response->json();

        if ($responseData['status'] === false) {
            return $this->handleFailedTransaction($responseData);
        }

        return $this->processSuccessfulTransaction($responseData['data']);
    }

    /**
     * refund paystack payment
     */
    public function refund(string $reference, float $amount): array
    {
        return [];
    }

    /**
     * verify paystack transaction by refrence id
     */
    private function verifyPaystackTransaction(string $token)
    {
        return Http::withToken($this->secretKey)
            ->get(config('services.paystack.payment_url') . '/transaction/verify/' . $token);
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
            'code' => $responseData['code'] ?? null
        ];
    }

    /**
     * handles payment transaction is failed
     */
    private function handleFailedTransaction(array $responseData): array
    {
        return [
            'status' => 'failed',
            'message' => $responseData['message'] ?? 'Transaction verification failed',
            'code' => $responseData['code'] ?? null
        ];
    }


    /**
     * handles payment transaction is success
     */
    private function processSuccessfulTransaction(array $transactionData): array
    {
        if ($transactionData['status'] !== 'success') {
            return [
                'status' => 'failed',
                'message' => $transactionData['message'] ?? 'Transaction not successful',
                'data' => $transactionData
            ];
        }

        return match ($transactionData['metadata']['type']) {
            PaymentType::CHECKOUT->value => $this->handleCheckoutPayment($transactionData),
            PaymentType::ADVERT->value => $this->handleAdvertPayment($transactionData),
            PaymentType::PROMOTION->value => $this->handlePromotionPayment($transactionData),
            default => [$transactionData]
        };
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

                $orderDetails = $order->load(['orderDetails', 'store']);

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
            'status' => OrderStatusEnum::PENDING_PAYMENT
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
            'status' => OrderStatusEnum::PENDING_PAYMENT
        ])->first();

        if ($promotion) {
            $promotion->update([
                'status' => OrderStatusEnum::PENDING,
            ]);
        }

        return [$transactionData];
    }
}
