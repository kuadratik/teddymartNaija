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
use App\Notifications\Listing\VendorNewOrderNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaystackEventBus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

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
                'event_type' => $eventType,
            ]);
            throw $e;
        }
    }

    /**
     * Process a successful charge by updating order statuses, recording payment transactions,
     * and attaching payments to corresponding orders.
     */
    private function processSuccessfulCharge(array $payload)
    {

        Log::info('Paystack processing processSuccessfulCharge');

        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);

        if (empty($paymentType)) {
            Log::warning('payment type is missing or malformed');

            return;
        }

        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed', ['payload' => $payload]);

            return;
        }

        if ($paymentType == PaymentType::ADVERT->value) {

            $advert = AdvertListingPromotePlan::where('order_number', $orderId)->first();

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
                        'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                        'status' => PaymentStatusEnum::SUCCESS,
                        'description' => 'paystack Payment for ads',
                    ]);
                }

                if ($advert->status !== OrderStatusEnum::ACTIVE->value) {
                    $advert->status = OrderStatusEnum::ACTIVE->value;
                    $advert->started_at = now();
                    $advert->expires_at = now()->addDays($advert->advertPromotePlan->duration_days);
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
                    'status_message' => 'APPROVED',
                    'response_payload' => json_encode($payload),
                ]);

                $customer = $advert->advertListing->user;
                $customer->notify(new AdvertSuccessNotification($advert->advertListing));
            });
        } elseif ($paymentType == PaymentType::PROMOTION->value) {

            $advert = StorePromotePlanStore::where('order_number', $orderId)->first();

            if (! $advert) {
                Log::error('No store promotion found', ['order_number' => $orderId]);

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
                        'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                        'status' => PaymentStatusEnum::SUCCESS,
                        'description' => 'paystack Payment for  promotion',
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
            try {
                DB::transaction(function () use ($orders, $paymentDetails, $payload) {
                    $payment = Payment::where('reference', $paymentDetails['reference'])->first();

                    if (! $payment) {
                        $payment = Payment::create([
                            'reference' => $paymentDetails['reference'],
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                            'description' => 'Paystack Payment',
                            'status' => $paymentDetails['status_message'],

                        ]);
                    }

                    foreach ($orders as $order) {
                        if (! $order->payments()->where('payment_id', $payment->id)->exists()) {
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
                            'status' => OrderStatusEnum::NEW,
                        ]);

                        $order->store->user->notify(new VendorNewOrderNotification($order));

                        $order->customer->notify(new OrderSuccessfulNotification($order));


                    }
                });
               return response()->json(['status' => 'success'], 200);
            } catch (\Exception $e) {
                Log::error('Failed to process successful charge', [
                    'order_number' => $orderId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        }
    }

    /**
     * Process a failed charge by updating order statuses, recording a failed payment transaction,
     * and handling advert-specific failure logic.
     */
    private function processFailedCharge(array $payload): void
    {
        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);

        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed for failed charge', ['payload' => $payload]);

            return;
        }

        if ($paymentType == PaymentType::ADVERT->value) {
            $advert = AdvertListingPromotePlan::where('order_number', $orderId)->first();

            if (! $advert) {
                Log::error('No advert listing promotion found for failed charge', ['order_number' => $orderId]);

                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            try {
                DB::transaction(function () use ($advert, $paymentDetails, $payload) {
                    $payment = Payment::firstOrCreate(
                        ['reference' => $paymentDetails['reference']],
                        [
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                            'status' => PaymentStatusEnum::FAILED,
                            'description' => 'Paystack Payment for advert - Failed',
                        ]
                    );

                    $advert->status = OrderStatusEnum::PAYMENT_FAILED->value;
                    $advert->payment_id = $payment->id;
                    $advert->save();

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => false,
                        'status_message' => 'FAILED',
                        'response_payload' => json_encode($payload),
                    ]);

                    Log::info('Advert marked as failed', [
                        'advert_id' => $advert->id,
                        'payment_reference' => $paymentDetails['reference'],
                    ]);
                });
            } catch (\Exception $e) {
                Log::error('Failed to process failed advert charge', [
                    'order_number' => $orderId,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
        } elseif ($paymentType == PaymentType::PROMOTION->value) {
            $promotion = StorePromotePlanStore::where('order_number', $orderId)->first();

            if (! $promotion) {
                Log::error('No store promotion found for failed charge', ['order_number' => $orderId]);

                return;
            }

            $paymentDetails = $this->extractPaymentDetails($payload);

            try {
                DB::transaction(function () use ($promotion, $paymentDetails, $payload) {
                    $payment = Payment::firstOrCreate(
                        ['reference' => $paymentDetails['reference']],
                        [
                            'amount' => $paymentDetails['amount'],
                            'currency' => $paymentDetails['currency'],
                            'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                            'status' => PaymentStatusEnum::FAILED,
                            'description' => 'Paystack Payment for promotion - Failed',
                        ]
                    );

                    $promotion->status = OrderStatusEnum::PAYMENT_FAILED->value;
                    $promotion->payment_id = $payment->id;
                    $promotion->save();

                    PaymentTransaction::create([
                        'payment_id' => $payment->id,
                        'reference' => $paymentDetails['reference'],
                        'type' => PaymentTransactionTypeEnum::CHARGE,
                        'amount' => $payment->amount,
                        'currency' => $payment->currency,
                        'is_success' => false,
                        'status_message' => 'FAILED',
                        'response_payload' => json_encode($payload),
                    ]);

                    Log::info('Store promotion marked as failed', [
                        'promotion_id' => $promotion->id,
                        'payment_reference' => $paymentDetails['reference'],
                    ]);
                });
            } catch (\Exception $e) {
                Log::error('Failed to process failed store promotion charge', [
                    'order_number' => $orderId,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
        } else {
            $orders = Order::where('order_number', $orderId)->get();
            if ($orders->isEmpty()) {
                Log::error('No orders found for failed charge', ['order_number' => $orderId]);

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
                            'status' => PaymentStatusEnum::FAILED,
                            'description' => 'Paystack Payment - Failed',
                        ]
                    );

                    foreach ($orders as $order) {
                        if (! $order->payments()->where('payment_id', $payment->id)->exists()) {
                            $order->payments()->attach($payment->id);
                        }

                        PaymentTransaction::create([
                            'payment_id' => $payment->id,
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
                            'status' => OrderStatusEnum::PENDING,
                        ]);

                        $order->customer->notify(new OrderPaymentFailedNotification($order));

                        Log::info('Order marked as failed', [
                            'order_id' => $order->id,
                            'order_number' => $order->order_number,
                            'payment_reference' => $paymentDetails['reference'],
                        ]);
                    }
                });
            } catch (\Exception $e) {
                Log::error('Failed to process failed charge for order', [
                    'order_number' => $orderId,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
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
        return $payload['data']['metadata']['order_number'] ?? '';
    }

    private function extractPaymentType(array $payload)
    {
        Log::info('payment type', [$payload['data']['metadata']['type'] ?? '']);

        return $payload['data']['metadata']['type'] ?? '';
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
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
