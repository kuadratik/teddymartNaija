<?php

namespace App\Jobs\Payment;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\PaymentTransactionTypeEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListingPromotePlan;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use App\Models\StorePromotePlanStore;
use App\Notifications\Listing\AdvertSuccessNotification;
use App\Notifications\Listing\OrderPaymentFailedNotification;
use App\Notifications\Listing\OrderSuccessfulNotification;
use App\Notifications\Listing\PaymentFailedNotification;
use App\Notifications\Listing\VendorNewOrderNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayPalEventBus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public array $webhookData)
    {
        //
    }

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

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
                // 'CHECKOUT.ORDER.APPROVED' => $this->processApprovedPayment($payload),
                'PAYMENT.CAPTURE.DECLINED',
                'PAYMENT.CAPTURE.DENIED' => $this->processFailedPayment($payload),
                default => Log::warning('Unhandled PayPal event type', ['event_type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('PayPal webhook processing error', [
                'error' => $e->getMessage(),
                'event_type' => $eventType,
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
        $paymentType = $this->extractPaymentType($payload);

        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed');

            return;
        }

        if (empty($paymentType)) {
            Log::warning('payment type is missing or malformed');

            return;
        }

        if ($paymentType == PaymentType::ADVERT->value) {
            $advert = AdvertListingPromotePlan::where('order_number', $orderId)->with('advertListing')->first();

            if (! $advert) {
                Log::error('No advert listing promotion found', ['order_number' => $orderId]);

                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            DB::transaction(function () use ($advert, $paymentDetails, $payload) {
                $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                if (! $payment) {
                    $payment = Payment::create([
                        'reference' => $paymentDetails['reference'],
                        'amount' => $paymentDetails['amount'],
                        'currency' => $paymentDetails['currency'],
                        'gateway' => PaymentGatewayEnum::PAYPAL->value,
                        'status' => PaymentStatusEnum::SUCCESS,
                        'description' => 'PayPal Payment for ads',
                    ]);
                }

                $advert->status = OrderStatusEnum::ACTIVE->value;
                $advert->started_at = now();
                $advert->expires_at = now()->addDays($advert->advertPromotePlan->duration);
                $advert->payment_id = $payment->id;
                $advert->save();

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
                $customer = $advert->advertListing->user;
                $customer->notify(new AdvertSuccessNotification($advert->advertListing));
            });
        } elseif ($paymentType == PaymentType::PROMOTION->value) {

            $advert = StorePromotePlanStore::where('order_number', $orderId)->first();

            if (! $advert) {
                Log::error('No advert listing promotion found', ['order_number' => $orderId]);

                return;
            }
            $paymentDetails = $this->extractPaymentDetails($payload);

            DB::transaction(function () use ($advert, $paymentDetails, $payload) {
                $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                if (! $payment) {
                    $payment = Payment::create([
                        'reference' => $paymentDetails['reference'],
                        'amount' => $paymentDetails['amount'],
                        'currency' => $paymentDetails['currency'],
                        'gateway' => PaymentGatewayEnum::PAYPAL->value,
                        'status' => PaymentStatusEnum::SUCCESS,
                        'description' => 'PayPal Payment for promotion',
                    ]);
                }

                $advert->status = OrderStatusEnum::ACTIVE->value;
                $advert->started_at = now();
                $advert->expires_at = now()->addDays($advert->storePromotePlan->duration);
                $advert->payment_id = $payment->id;
                $advert->save();

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
            });
        } else {

            $orders = Order::where('order_number', $orderId)->with(['orderDetails.listing'])->get();

            if ($orders->isEmpty()) {
                Log::error('No orders found', ['order_number' => $orderId]);

                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            try {
                DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                    $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                    if (! $payment) {
                        $payment = Payment::create([
                            'reference' => $paymentDetails['reference'],
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYPAL->value,
                            'status' => PaymentStatusEnum::SUCCESS,
                            'description' => 'PayPal Payment',
                        ]);
                    }

                    $orderNumbers = $orders->pluck('order_number')->toArray();

                    $enhancedPayload = array_merge($payload, [
                        'additional_data' => [
                            'order_numbers' => $orderNumbers,
                        ],
                    ]);

                    foreach ($orders as $order) {
                        if ($order->payment_status !== OrderStatusEnum::APPROVED_PAYMENT) {
                            Log::warning('Skipping order - Invalid state transition', [
                                'order_id' => $order->id,
                                'order_number' => $order->order_number,
                                'current_status' => $order->payment_status,
                            ]);

                            continue;
                        }

                        if (! $order->payments()->where('payment_id', $payment->id)->exists()) {
                            $order->payments()->attach($payment->id);
                        }

                        $order->update([
                            'payment_status' => OrderStatusEnum::COMPLETED_PAYMENT,
                            'status' => OrderStatusEnum::NEW,
                        ]);

                        $this->processOrderDetails($order);
                    }

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => true,
                        'status_message' => 'COMPLETED',
                        'response_payload' => json_encode($enhancedPayload),
                    ]);
                });
            } catch (\Exception $e) {
                Log::error('Failed to process completed payment', [
                    'order_number' => $orderId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        }
    }

    /**
     * Process an approved payment by creating a new payment record, updating order statuses,
     * and recording a payment transaction. If the order ID is missing or malformed, appropriate logs are generated.
     */
    private function processApprovedPayment(array $payload)
    {
        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);

        if (empty($orderId)) {
            Log::warning('Failed payment: Order ID missing');

            return;
        }

        if (empty($paymentType)) {
            Log::warning('payment type is missing or malformed');

            return;
        }

        if ($paymentType == PaymentType::ADVERT->value) {
            $advert = AdvertListingPromotePlan::where('order_number', $orderId)->first();

            if (! $advert) {
                Log::error('No advert listing promotion found', ['order_number' => $orderId]);

                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            DB::transaction(
                function () use ($advert, $paymentDetails, $payload) {

                    $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                    if (! $payment) {

                        $payment = Payment::create([
                            'reference' => $paymentDetails['reference'],
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYPAL->value,
                            'status' => PaymentStatusEnum::SUCCESS,
                            'description' => 'paypal Payment for ads',
                        ]);
                    }

                    $advert->status = OrderStatusEnum::ACTIVE->value;
                    $advert->started_at = now();
                    $advert->expires_at = now()->addDays($advert->advertPromotePlan->duration);
                    $advert->payment_id = $payment->id;
                    $advert->save();

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

                    $customer = $advert->advertListing->user;
                    $customer->notify(new AdvertSuccessNotification($advert->advertListing));
                }
            );
        } elseif ($paymentType == PaymentType::PROMOTION->value) {

            $advert = StorePromotePlanStore::where('order_number', $orderId)->first();

            if (! $advert) {
                Log::error('No advert listing promotion found', ['order_number' => $orderId]);

                return;
            }
            $paymentDetails = $this->extractPaymentDetails($payload);

            DB::transaction(function () use ($advert, $paymentDetails, $payload) {
                $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                if (! $payment) {

                    $payment = Payment::create([
                        'reference' => $paymentDetails['reference'],
                        'amount' => $paymentDetails['amount'],
                        'currency' => $paymentDetails['currency'],
                        'gateway' => PaymentGatewayEnum::PAYPAL->value,
                        'status' => PaymentStatusEnum::SUCCESS,
                        'description' => 'paypal Payment for promotion',
                    ]);
                }
                if ($advert->status !== OrderStatusEnum::ACTIVE->value) {
                    $advert->status = OrderStatusEnum::ACTIVE->value;
                    $advert->started_at = now();
                    $advert->expires_at = now()->addDays($advert->storePromotePlan->duration_days);
                    $advert->payment_id = $payment->id;
                    $advert->save();
                }

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
            });
        } else {

            $orders = Order::where('order_number', $orderId)->get();

            if ($orders->isEmpty()) {
                Log::error('No orders found', ['order_number' => $orderId]);

                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                if (! $payment) {

                    $payment = Payment::create([
                        'reference' => $paymentDetails['reference'],
                        'amount' => $paymentDetails['amount'],
                        'currency' => $paymentDetails['currency'],
                        'gateway' => PaymentGatewayEnum::PAYPAL->value,
                        'status' => PaymentStatusEnum::SUCCESS,
                        'description' => 'paypal Payment',
                    ]);
                }

                $orderNumbers = $orders->pluck('order_number')->toArray();

                $enhancedPayload = array_merge($payload, [
                    'additional_data' => [
                        'order_numbers' => $orderNumbers,
                    ],
                ]);

                foreach ($orders as $order) {
                    if (! $order->payments()->where('payment_id', $payment->id)->exists()) {
                        $order->payments()->attach($payment->id);
                    }

                    $order->payment_status = OrderStatusEnum::APPROVED_PAYMENT;
                    $order->status = OrderStatusEnum::NEW;
                    $order->save();
                    $order->store->user->notify(new VendorNewOrderNotification($order));
                    $order->customer->notify(new OrderSuccessfulNotification($order));
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

            return response()->json(['status' => 'success'], 200);
        }
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
            Log::warning('Failed payment: Order ID missing');

            return;
        }

        if (empty($paymentType)) {
            Log::warning('Payment type is missing or malformed');

            return;
        }

        $paymentDetails = $this->extractPaymentDetails($payload);

        try {
            if ($paymentType == PaymentType::ADVERT->value) {
                $advert = AdvertListingPromotePlan::where('order_number', $orderId)->first();

                if (! $advert) {
                    Log::error('No advert listing promotion found', ['order_number' => $orderId]);

                    return;
                }

                DB::transaction(function () use ($advert, $paymentDetails, $payload) {
                    $payment = Payment::firstOrCreate(
                        ['reference' => $paymentDetails['reference']],
                        [
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYPAL->value,
                            'status' => PaymentStatusEnum::FAILED,
                            'description' => 'paypal Payment - Failed for advert',
                        ]
                    );

                    $advert->update([
                        'status' => OrderStatusEnum::PAYMENT_FAILED,
                        'failure_reason' => $paymentDetails['failure_reason'],
                    ]);

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => false,
                        'status_message' => $paymentDetails['status_message'],
                        'response_payload' => json_encode($payload),
                    ]);
                });
            } elseif ($paymentType == PaymentType::PROMOTION->value) {
                $advert = StorePromotePlanStore::where('order_number', $orderId)->first();

                if (! $advert) {
                    Log::error('No store promotion found', ['order_number' => $orderId]);

                    return;
                }

                DB::transaction(function () use ($advert, $paymentDetails, $payload) {
                    $payment = Payment::firstOrCreate(
                        ['reference' => $paymentDetails['reference']],
                        [
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYPAL->value,
                            'status' => PaymentStatusEnum::FAILED,
                            'description' => 'paypal Payment - Failed for promotion',
                        ]
                    );

                    $advert->update([
                        'status' => OrderStatusEnum::PAYMENT_FAILED,
                        'failure_reason' => $paymentDetails['failure_reason'],
                    ]);

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => false,
                        'status_message' => $paymentDetails['status_message'],
                        'response_payload' => json_encode($payload),
                    ]);
                });
            } else {
                $orders = Order::where('order_number', $orderId)->get();

                if ($orders->isEmpty()) {
                    Log::error('No orders found', ['order_number' => $orderId]);

                    return;
                }

                DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                    $payment = Payment::firstOrCreate(
                        ['reference' => $paymentDetails['reference']],
                        [
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYPAL->value,
                            'status' => PaymentStatusEnum::FAILED,
                            'description' => 'paypal Payment - Failed for order',
                        ]
                    );

                    $orderNumbers = $orders->pluck('order_number')->toArray();
                    $enhancedPayload = array_merge($payload, [
                        'additional_data' => [
                            'order_numbers' => $orderNumbers,
                        ],
                    ]);

                    foreach ($orders as $order) {
                        if (! $order->payments()->where('payment_id', $payment->id)->exists()) {
                            $order->payments()->attach($payment->id);
                        }

                        $order->update([
                            'payment_status' => OrderStatusEnum::PAYMENT_FAILED,
                            'status' => OrderStatusEnum::PENDING,
                            'failure_reason' => $paymentDetails['failure_reason'],
                        ]);

                        PaymentTransaction::create([
                            'payment_id' => $payment->id,
                            'reference' => $paymentDetails['reference'],
                            'type' => PaymentTransactionTypeEnum::CHARGE,
                            'amount' => $payment->amount,
                            'currency' => $payment->currency,
                            'is_success' => false,
                            'status_message' => $paymentDetails['status_message'],
                            'response_payload' => json_encode($enhancedPayload),
                        ]);

                        $order->customer->notify(new OrderPaymentFailedNotification($order));
                    }
                });
            }

            Log::info('Payment failure processed', [
                'order_id' => $orderId,
                'gateway' => PaymentGatewayEnum::PAYPAL->value,
                'reason' => $paymentDetails['failure_reason'],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process failed payment', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
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
            'amount' => $resource['amount']['value'] ?? $purchaseUnit['amount']['value']  ?? null,
            'currency' => $resource['amount']['currency_code'] ?? $purchaseUnit['amount']['currency_code']  ?? null,
            'status_message' => $resource['status'] ?? 'FAILED',
            'failure_reason' => $resource['status_details']['reason'] ?? 'Unknown error',
        ];
    }



    /**
     * Extracts the order ID from the provided payload array.
     */
    private function extractOrderId(array $payload): string
    {
        $customId = $payload['resource']['purchase_units'][0]['custom_id'] ??  $payload['resource']['custom_id'] ?? '';
        $customData = json_decode($customId, true);

        return $customData['order_number'] ?? '';
    }

    /**
     * Extracts the payment type from the provided payload array.
     */
    private function extractPaymentType(array $payload): string
    {
        $customId = $payload['resource']['purchase_units'][0]['custom_id'] ??  $payload['resource']['custom_id'] ?? '';
        $customData = json_decode($customId, true);

        return $customData['type'] ?? '';
    }


    /**
     * Process order details and update listing quantities atomically
     *
     * @param Order $order
     * @throws \Throwable
     */
    private function processOrderDetails(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order->load(['orderDetails.listing' => function ($query) {
                $query->lockForUpdate();
            }]);

            $orderDetails = $order->orderDetails;

            foreach ($orderDetails as $orderDetail) {
                try {
                    $listing = $orderDetail->listing;

                    if (!$listing) {
                        throw new \RuntimeException("Listing not found for order detail {$orderDetail->id}");
                    }

                    $affectedRows = $listing->newQuery()
                        ->where('id', $listing->id)
                        ->where('quantity', '>=', $orderDetail->quantity)
                        ->decrement('quantity', $orderDetail->quantity);

                    if ($affectedRows === 0) {
                        throw new \RuntimeException("Insufficient quantity for listing {$listing->id}. Available: {$listing->quantity}, Required: {$orderDetail->quantity}");
                    }

                    $listing->refresh();
                } catch (\Throwable $e) {
                    Log::error('Order processing failed', [
                        'order_detail_id' => $orderDetail->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    throw $e;
                }
            }
        }, 5);
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
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
