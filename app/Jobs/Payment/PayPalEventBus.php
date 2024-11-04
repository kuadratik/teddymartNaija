<?php

namespace App\Jobs\Payment;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\PaymentTransactionTypeEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListing;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayPalEventBus implements ShouldQueue
{
    use Queueable, InteractsWithQueue, Dispatchable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public array $webhookData)
    {
        //
    }

    /**
     * Returns the maximum number of attempts for processing the job.
     */
    public function maxAttempts()
    {
        return 5;
    }

    /**
     * Returns the time until the job should be retried, which is 10 minutes from the current time.
     */
    public function retryUntil()
    {
        return now()->addMinutes(10);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $eventType = $this->webhookData['event_type'];
        $payload = $this->webhookData['payload'];
        Log::info('PayPal Event Received', ['event_type' => $eventType]);

        try {
            match ($eventType) {
                'PAYMENT.CAPTURE.COMPLETED' => $this->processCompletedPayment($payload),
                'CHECKOUT.ORDER.APPROVED' => $this->processApprovedPayment($payload),
                'PAYMENT.CAPTURE.DECLINED',
                'PAYMENT.CAPTURE.DENIED' => $this->processFailedPayment($payload),
                default => Log::warning('Unhandled PayPal event type', ['event_type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('PayPal webhook processing error', [
                'error' => $e->getMessage(),
                'event_type' => $eventType
            ]);
            throw $e;
        }
    }


    /**
     * Process a completed payment by updating order statuses, recording payment transactions,
     * and attaching payments to corresponding orders. Logs warnings for invalid state transitions.
     * If the order ID is missing or malformed, appropriate logs are generated.
     */
    private function processCompletedPayment(array $payload): void
    {
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

        try {
            DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                if ($payment) {
                    foreach ($orders as $order) {
                        if ($order->payment_status !== OrderStatusEnum::APPROVED_PAYMENT) {
                            Log::warning('Skipping order - Invalid state transition', [
                                'order_id' => $order->id,
                                'order_number' => $order->order_number,
                                'current_status' => $order->payment_status
                            ]);
                            continue;
                        }

                        if (!$order->payments()->where('payment_id', $payment->id)->exists()) {
                            $order->payments()->attach($payment->id);
                        }

                        $enhancedPayload = array_merge($payload, [
                            'additional_data' => [
                                'order_id' => $order->id,
                                'order_number' => $order->order_number
                            ]
                        ]);

                        PaymentTransaction::create([
                            'payment_id' => $payment->id,
                            'reference' => $paymentDetails['reference'],
                            'type' => PaymentTransactionTypeEnum::CHARGE,
                            'amount' => $payment->amount,
                            'currency' => $payment->currency,
                            'is_success' => true,
                            'status_message' => 'COMPLETED',
                            'response_payload' => json_encode($enhancedPayload)
                        ]);

                        // Update each order's status
                        $order->update([
                            'payment_status' => OrderStatusEnum::COMPLETED_PAYMENT,
                            'status' => OrderStatusEnum::INPROGRESS,
                        ]);

                        Log::info('Order completed successfully', [
                            'order_id' => $order->id,
                            'order_number' => $order->order_number,
                            'payment_reference' => $paymentDetails['reference']
                        ]);
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('Failed to process completed payment', [
                'order_number' => $orderId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }


    /**
     * Process an approved payment by creating a new payment record, updating order statuses,
     * and recording a payment transaction. If the order ID is missing or malformed, appropriate logs are generated.
     */
    private function processApprovedPayment(array $payload): void
    {
        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);

        if (empty($orderId)) {
            Log::warning('Failed payment: Order ID missing', ['payload' => $payload]);
            return;
        }

        if ($paymentType == PaymentType::ADVERT->value) {
            $advert = DB::table('advert_listing_promote_plans')->where('order_number', $orderId)->first();

            if ($advert->isEmpty()) {
                Log::error('No advert listing promotion found', ['order_number' => $orderId]);
                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            DB::transaction(
                function () use ($advert, $paymentDetails, $payload) {

                    $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                    if (!$payment) {

                        $payment = Payment::create([
                            'reference' => $paymentDetails['reference'],
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYPAL->value,
                            'status' => PaymentStatusEnum::SUCCESS,
                            'description' => "paypal Payment for ads"
                        ]);
                    }

                    $advert->update([
                        'status' => OrderStatusEnum::ACTIVE->value,
                        'started_at' => now(),
                    ]);

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => true,
                        'status_message' => 'APPROVED',
                        'response_payload' => json_encode($payload),
                    ]);
                }
            );
        }

        $orders = Order::where('order_number', $orderId)->get();

        if ($orders->isEmpty()) {
            Log::error('No orders found', ['order_number' => $orderId]);
            return;
        }

        $paymentDetails = $this->extractPaymentDetails($payload);


        DB::transaction(function () use ($orders, $paymentDetails, $payload) {
            $payment = Payment::where('reference', $paymentDetails['reference'])->first();

            if (!$payment) {

                $payment = Payment::create([
                    'reference' => $paymentDetails['reference'],
                    'amount' => $paymentDetails['amount'],
                    'currency' => $paymentDetails['currency'],
                    'gateway' => PaymentGatewayEnum::PAYPAL->value,
                    'status' => PaymentStatusEnum::SUCCESS,
                    'description' => "paypal Payment"
                ]);
            }



            $orderNumbers = $orders->pluck('order_number')->toArray();

            $enhancedPayload = array_merge($payload, [
                'additional_data' => [
                    'order_numbers' => $orderNumbers
                ]
            ]);


            foreach ($orders as $order) {
                if (!$order->payments()->where('payment_id', $payment->id)->exists()) {
                    $order->payments()->attach($payment->id);
                }

                $order->payment_status = OrderStatusEnum::APPROVED_PAYMENT;
                $order->status = OrderStatusEnum::INPROGRESS;
                $order->save();
            }

            PaymentTransaction::create([
                'payment_id' => $payment->id,
                'reference' => $paymentDetails['reference'],
                'type' => PaymentTransactionTypeEnum::CHARGE,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'is_success' => true,
                'status_message' => 'APPROVED',
                'response_payload' => json_encode($enhancedPayload),
            ]);
        });
    }

    /**
     * Process a failed payment by creating a new payment record, updating order statuses,
     * and recording a payment transaction. If the order ID is missing, appropriate logs are generated.
     */
    private function processFailedPayment(array $payload): void
    {
        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);
        if (empty($orderId)) {
            Log::warning('Failed payment: Order ID missing', ['payload' => $payload]);
            return;
        }

        if ($paymentType == PaymentType::ADVERT->value) {
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
                        'gateway' => $this->webhookData['gateway']->value,
                        'status' => PaymentStatusEnum::FAILED,
                        'description' => "{$this->webhookData['gateway']->value} Payment - Failed"
                    ]
                );
                $orderNumbers = $orders->pluck('order_number')->toArray();
                $enhancedPayload = array_merge($payload, [
                    'additional_data' => [
                        'order_numbers' => $orderNumbers
                    ]
                ]);

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
                        'is_success' => false,
                        'status_message' => $paymentDetails['status_message'],
                        'response_payload' => json_encode($enhancedPayload)
                    ]);

                    $order->update([
                        'payment_status' => OrderStatusEnum::PAYMENT_FAILED,
                        'status' => OrderStatusEnum::INPROGRESS,
                        'failure_reason' => $paymentDetails['failure_reason']
                    ]);
                }
            });

            Log::info('Payment failure processed', [
                'order_id' => $orderId,
                'gateway' => $this->webhookData['gateway']->value,
                'reason' => $paymentDetails['failure_reason']
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process failed payment', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }


    /**
     * Extracts payment details from the given payload array.
     */
    private function extractPaymentDetails(array $payload): array
    {
        $purchaseUnit = $payload['resource']['purchase_units'][0] ?? [];
        $resource = $payload['resource'] ?? [];

        return [
            'reference' => $resource['id'] ?? '',
            'amount' => $purchaseUnit['amount']['value'] ?? null,
            'currency' => $purchaseUnit['amount']['currency_code'] ?? null,
            'status_message' => $resource['status'] ?? 'FAILED',
            'failure_reason' => $resource['status_details']['reason'] ?? 'Unknown error',
        ];
    }


    /**
     * Extracts the order ID from the provided payload array.
     */
    private function extractOrderId(array $payload): string
    {
        $customId = $payload['resource']['purchase_units'][0]['custom_id'] ?? '';
        $customData = json_decode($customId, true);
        return $customData['order_number'] ?? '';
    }
    /**
     * Extracts the payment type from the provided payload array.
     */
    private function extractPaymentType(array $payload): string
    {
        $customId = $payload['resource']['purchase_units'][0]['custom_id'] ?? '';
        $customData = json_decode($customId, true);
        return $customData['type'] ?? '';
    }



    /**
     * Logs the details of a failed payment event in the PayPal Event Bus.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Payment Event Bus Failed', [
            'gateway' => $this->webhookData['gateway']->value ?? 'unknown',
            'event_type' => $this->webhookData['event_type'] ?? 'unknown',
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}
