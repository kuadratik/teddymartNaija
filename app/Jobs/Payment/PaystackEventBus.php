<?php

namespace App\Jobs\Payment;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentTransactionTypeEnum;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PaystackEventBus implements ShouldQueue
{
    use Queueable, InteractsWithQueue, Dispatchable, SerializesModels;

    public function __construct(public array $webhookData)
    {
        //
    }

    public function handle(): void
    {
        $eventType = $this->webhookData['event_type'];
        $payload = $this->webhookData['payload'];
        Log::info('Paystack Event Received', ['event_type' => $eventType]);

        try {
            match ($eventType) {
                'charge.success' => $this->processSuccessfulCharge($payload),
                'charge.failed' => $this->processFailedCharge($payload),
                default => Log::warning('Unhandled Paystack event type', ['event_type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('Paystack webhook processing error', [
                'error' => $e->getMessage(),
                'event_type' => $eventType
            ]);
            throw $e;
        }
    }

    /**
     * Process a successful charge by updating order statuses, recording payment transactions,
     * and attaching payments to corresponding orders.
     */
    private function processSuccessfulCharge(array $payload): void
    {

        Log::info('Paystack processing processSuccessfulCharge', ['event_type' => $payload]);
        $orderId = $this->extractOrderId($payload);

        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed', ['payload' => $payload]);
            return;
        }

        $orders = Order::where('order_number', $orderId)->get();
        if ($orders->isEmpty()) {
            Log::error('No orders found', ['order_number' => $orderId]);
            return;
        }

        $paymentDetails = $this->extractPaymentDetails($payload);
        Log::debug('paymentDetails found', ['paymentDetails' => $paymentDetails]);
        try {
            DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                if (!$payment) {
                    $payment = Payment::create([
                        'reference' => $paymentDetails['reference'],
                        'amount' => $paymentDetails['amount'],
                        'currency' => $paymentDetails['currency'],
                        'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                        'description' => "Paystack Payment",
                        'status' => $paymentDetails['status_message']

                    ]);
                }

                foreach ($orders as $order) {
                    if (!$order->payments()->where('payment_id', $payment->id)->exists()) {
                        $order->payments()->attach($payment->id);
                    }

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => true,
                        'status_message' => 'COMPLETED',
                        'response_payload' => json_encode($payload),
                    ]);

                    $order->update([
                        'payment_status' => OrderStatusEnum::COMPLETED_PAYMENT,
                        'status' => 'COMPLETED',
                    ]);

                    Log::info('Order completed successfully', [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'payment_reference' => $paymentDetails['reference']
                    ]);
                    return response()->json(['status' => 'success'], 200);
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to process successful charge', [
                'order_number' => $orderId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Process a failed charge by updating order statuses and recording a failed payment transaction.
     */
    private function processFailedCharge(array $payload): void
    {
        $orderId = $this->extractOrderId($payload);
        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed for failed charge', ['payload' => $payload]);
            return;
        }

        $orders = Order::where('order_number', $orderId)->get();
        if ($orders->isEmpty()) {
            Log::error('No orders found', ['order_number' => $orderId]);
            return;
        }

        $paymentDetails = $this->extractPaymentDetails($payload);

        try {
            DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                $payment = Payment::firstOrCreate(
                    ['reference' => $paymentDetails['reference']],
                    [
                        'amount' => $paymentDetails['amount'],
                        'currency' => $paymentDetails['currency'],
                        'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                        'description' => "Paystack Payment - Failed"
                    ]
                );

                foreach ($orders as $order) {
                    if (!$order->payments()->where('payment_id', $payment->id)->exists()) {
                        $order->payments()->attach($payment->id);
                    }

                    $payment->recordTransaction([
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => false,
                        'status_message' => 'FAILED',
                        'response_payload' => json_encode($payload),
                    ]);

                    $order->update([
                        'payment_status' => OrderStatusEnum::PAYMENT_FAILED,
                        'status' => 'FAILED',
                    ]);

                    Log::info('Order marked as failed', [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'payment_reference' => $paymentDetails['reference']
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to process failed charge', [
                'order_number' => $orderId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Extracts payment details from the Paystack payload.
     */
    private function extractPaymentDetails(array $payload): array
    {
        return [
            'reference' => $payload['data']['reference'] ?? '',
            'amount' => ($payload['data']['amount'] ?? 0) / 100,
            'currency' => $payload['data']['currency'] ?? 'NGN',
            'status_message' => $payload['data']['status'] ?? 'FAILED',
        ];
    }

    /**
     * Extracts the order ID from the Paystack payload.
     */
    private function extractOrderId(array $payload): string
    {
        // Log::debug('Extracting order ID from Paystack payload', ['number' => $payload['data']['metadata']['order_number']]);
        return $payload['data']['metadata']['order_number'] ?? '';
    }

    public function maxAttempts()
    {
        return 5;
    }

    public function retryUntil()
    {
        return now()->addMinutes(10);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Paystack Event Bus Failed', [
            'gateway' => PaymentGatewayEnum::PAYSTACK->value,
            'event_type' => $this->webhookData['event_type'] ?? 'unknown',
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}
