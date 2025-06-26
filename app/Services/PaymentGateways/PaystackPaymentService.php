<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListingPromotePlan;
use App\Models\Order;
use App\Models\StorePayoutDetail;
use App\Models\StorePromotePlanStore;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackPaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly ?string $secretKey)
    {
        //
    }

    /**
     * initialize paystack payment
     */
    public function initialize(array $data): array
    {
        $response = Http::withToken($this->secretKey)->post(config('services.paystack.payment_url').'/transaction/initialize', [
            'email' => $data['email'] ?? Auth::user()->email,
            'amount' => $data['total_amount'] * 100,
            "currency" => $data['currency_code'],
            "callback_url" => $data['return_url'] ?? route('payment.success'),
            'metadata' => [
                'order_number' => $data['order_number'],
                'type' => $data['type'] ?? PaymentType::CHECKOUT->value,
                'cancel_url' => $data['cancel_url'] ?? route('payment.cancel'),
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

        if (! $response->successful()) {
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
     * Process payout via Paystack.
     */
    public function transfer(Order $order, StorePayoutDetail $payoutDetail): array
    {

        $recipientId = $payoutDetail->paystack_recipient_code;
        if (! $recipientId) {
            $recipientResponse = $this->createTransferRecipient(
                $payoutDetail->account_name,
                $payoutDetail->account_number,
                $payoutDetail->bank_code
            );

            if (! $recipientResponse['status']) {
                Log::error('Failed to create Paystack recipient', [
                    'order_id' => $order->id,
                    'response' => $recipientResponse,
                ]);

                return [];
            }

            $recipientId = $recipientResponse['data']['recipient_code'];
            $payoutDetail->update(['paystack_recipient_code' => $recipientId]);
        }

        $transferResponse = Http::withToken($this->secretKey)
            ->post(config('services.paystack.payment_url').'/transfer', [
                'source' => 'balance',
                'amount' => $order->payoutAmount * 100,
                'currency' => $order->currency,
                'recipient' => $recipientId,
                'reason' => "Payout for order {$order->order_number}",
                'reference' => $order->uid,
            ]);

        if (! $transferResponse->successful()) {
            Log::error('Failed to process Paystack transfer', [
                'order_id' => $order->id,
                'response' => $transferResponse->json(),
            ]);
        }

        return $transferResponse->json();
    }

    /**
     * Validate bank details with Paystack.
     */
    public function validateBankDetails(string $accountNumber, string $bankCode): array
    {
        $response = Http::withToken($this->secretKey)
            ->get(config('services.paystack.payment_url').'/bank/resolve', [
                'account_number' => $accountNumber,
                'bank_code' => $bankCode,
            ]);

        return $response->json();
    }

    /**
     * Create a transfer recipient with Paystack.
     */
    public function createTransferRecipient(string $accountName, string $accountNumber, string $bankCode): array
    {
        $response = Http::withToken($this->secretKey)
            ->post(config('services.paystack.payment_url').'/transferrecipient', [
                'type' => 'nuban',
                'name' => $accountName,
                'account_number' => $accountNumber,
                'bank_code' => $bankCode,
                'currency' => 'NGN',
            ]);

        return $response->json();
    }

    /**
     * get accepted banks
     */
    public function acceptedBanks(?string $search = null, ?string $next = null, ?string $prev = null, int $perPage = 100): array
    {
        $banks = Http::withToken(config('paystack.secret_key'))
            ->get(
                'https://api.paystack.co/bank',
                [
                    'perPage' => $perPage,
                    'next' => $next,
                    'previous' => $prev,
                    'country' => 'nigeria',
                    'use_cursor' => false,
                ]
            );

        return ['banks' => $banks['data'], 'meta' => $banks['meta'] ?? null];
    }

    /**
     * verify paystack transaction by refrence id
     */
    private function verifyPaystackTransaction(string $token)
    {
        return Http::withToken($this->secretKey)
            ->get(config('services.paystack.payment_url').'/transaction/verify/'.$token);
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
    private function handleFailedTransaction(array $responseData): array
    {
        return [
            'status' => 'failed',
            'message' => $responseData['message'] ?? 'Transaction verification failed',
            'code' => $responseData['code'] ?? null,
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
                'data' => $transactionData,
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

                if ($order->payment_status == OrderStatusEnum::PENDING_PAYMENT->value && ! OrderStatusEnum::COMPLETED_PAYMENT->value) {
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
}
