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

    public function __construct(public array $webhookData) {}

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
     * Process a payment event based on status and type
     */
    private function processPaymentEvent(array $payload, bool $isSuccess): void
    {
        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);

        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed', ['payload' => json_encode($payload)]);
            return;
        }

        if (empty($paymentType)) {
            Log::warning('Payment type is missing or malformed');
            return;
        }

        $paymentDetails = $this->extractPaymentDetails($payload);
        $paymentStatus = $isSuccess ? PaymentStatusEnum::SUCCESS : PaymentStatusEnum::FAILED;
        $orderStatus = $isSuccess ? OrderStatusEnum::ACTIVE : OrderStatusEnum::PAYMENT_FAILED;
        $orderPaymentStatus = $isSuccess ? OrderStatusEnum::COMPLETED_PAYMENT : OrderStatusEnum::PAYMENT_FAILED;
        $statusMessage = $isSuccess ? 'APPROVED' : 'FAILED';

        try {
            match ($paymentType) {
                PaymentType::ADVERT->value => $this->processAdvertPayment($orderId, $paymentDetails, $payload, $paymentStatus, $orderStatus, $statusMessage),
                PaymentType::PROMOTION->value => $this->processPromotionPayment($orderId, $paymentDetails, $payload, $paymentStatus, $orderStatus, $statusMessage),
                default => $this->processOrderPayment($orderId, $paymentDetails, $payload, $paymentStatus, $orderPaymentStatus, $statusMessage),
            };
        } catch (\Exception $e) {
            $status = $isSuccess ? 'successful' : 'failed';
            Log::error("Failed to process {$status} charge", [
                'order_id' => $orderId,
                'payment_type' => $paymentType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Process a successful charge
     */
    private function processSuccessfulCharge(array $payload): void
    {
        Log::info('Paystack processing processSuccessfulCharge');
        $this->processPaymentEvent($payload, true);
    }

    /**
     * Process a failed charge
     */
    private function processFailedCharge(array $payload): void
    {
        $this->processPaymentEvent($payload, false);
    }

    /**
     * Process advertisement payment
     */
    private function processAdvertPayment(string $orderId, array $paymentDetails, array $payload, PaymentStatusEnum $paymentStatus, OrderStatusEnum $orderStatus, string $statusMessage): void
    {
        $advert = AdvertListingPromotePlan::where('order_number', $orderId)->with('advertListing')->first();

        if (!$advert) {
            Log::error('No advert listing promotion found', ['order_number' => $orderId]);
            return;
        }

        DB::transaction(function () use ($advert, $paymentDetails, $payload, $paymentStatus, $orderStatus, $statusMessage) {
            $payment = $this->findOrCreatePayment(
                $paymentDetails,
                $paymentStatus,
                'Paystack Payment for ads' . ($statusMessage === 'FAILED' ? ' - Failed' : '')
            );

            if ($orderStatus === OrderStatusEnum::ACTIVE && $advert->status === OrderStatusEnum::ACTIVE->value && $advert->payment_id === $payment->id) {
                Log::info('Advert is already active, skipping update.', ['order_number' => $advert->order_number]);
                return;
            }

            if ($orderStatus === OrderStatusEnum::ACTIVE) {
                $advert->status = $orderStatus->value;
                $advert->started_at = now();
                $advert->expires_at = now()->addDays($advert->advertPromotePlan->duration_days);
            } else {
                $advert->status = $orderStatus->value;
            }

            $advert->payment_id = $payment->id;
            $advert->save();

            $this->createPaymentTransaction($payment, $paymentDetails, $payload, $statusMessage !== 'FAILED', $statusMessage);

            if ($orderStatus === OrderStatusEnum::ACTIVE && isset($advert->advertListing->user)) {
                $advert->advertListing->user->notify(new AdvertSuccessNotification($advert->advertListing));
            }

            Log::info('Advert payment processed', [
                'advert_id' => $advert->id,
                'status' => $orderStatus->value,
                'payment_reference' => $paymentDetails['reference'],
            ]);
        });
    }

    /**
     * Process promotion payment
     */
    private function processPromotionPayment(string $orderId, array $paymentDetails, array $payload, PaymentStatusEnum $paymentStatus, OrderStatusEnum $orderStatus, string $statusMessage): void
    {
        $promotion = StorePromotePlanStore::where('order_number', $orderId)->first();

        if (!$promotion) {
            Log::error('No store promotion found', ['order_number' => $orderId]);
            return;
        }

        DB::transaction(function () use ($promotion, $paymentDetails, $payload, $paymentStatus, $orderStatus, $statusMessage) {
            $payment = $this->findOrCreatePayment(
                $paymentDetails,
                $paymentStatus,
                'Paystack Payment for promotion' . ($statusMessage === 'FAILED' ? ' - Failed' : '')
            );

            if ($orderStatus === OrderStatusEnum::ACTIVE && $promotion->status === OrderStatusEnum::ACTIVE->value && $promotion->payment_id === $payment->id) {
                Log::info('Promotion is already active, skipping update.', ['order_number' => $promotion->order_number]);
                return;
            }

            if ($orderStatus === OrderStatusEnum::ACTIVE) {
                $promotion->status = $orderStatus->value;
                $promotion->started_at = now();
                $promotion->expires_at = now()->addDays($promotion->storePromotePlan->duration_days);
            } else {
                $promotion->status = $orderStatus->value;
            }

            $promotion->payment_id = $payment->id;
            $promotion->save();

            $this->createPaymentTransaction($payment, $paymentDetails, $payload, $statusMessage !== 'FAILED', $statusMessage);

            Log::info('Promotion payment processed', [
                'promotion_id' => $promotion->id,
                'status' => $orderStatus->value,
                'payment_reference' => $paymentDetails['reference'],
            ]);
        });
    }

    /**
     * Process order payment
     */
    private function processOrderPayment(string $orderId, array $paymentDetails, array $payload, PaymentStatusEnum $paymentStatus, OrderStatusEnum $orderPaymentStatus, string $statusMessage): void
    {
        $orders = Order::where('order_number', $orderId)->with(['orderDetails.listing'])->get();

        if ($orders->isEmpty()) {
            Log::error('No orders found', ['order_number' => $orderId]);
            return;
        }

        DB::transaction(function () use ($orders, $paymentDetails, $payload, $paymentStatus, $orderPaymentStatus, $statusMessage) {
            $payment = $this->findOrCreatePayment($paymentDetails, $paymentStatus, 'Paystack Payment' . ($statusMessage === 'FAILED' ? ' - Failed' : ''));
            $isSuccess = $statusMessage !== 'FAILED';
            $orderStatus = $isSuccess ? OrderStatusEnum::NEW : OrderStatusEnum::PENDING;

            foreach ($orders as $order) {
                if (!$order->payments()->where('payment_id', $payment->id)->exists()) {
                    $order->payments()->attach($payment->id);
                }

                $order->payment_status = $orderPaymentStatus->value;
                $order->status = $orderStatus->value;
                $order->save();

                $this->createPaymentTransaction($payment, $paymentDetails, $payload, $isSuccess, $statusMessage);

                if (!$isSuccess) {
                    if (isset($order->customer)) {
                        $order->customer->notify(new OrderPaymentFailedNotification($order));
                    }

                    continue;
                }

                $this->processOrderDetails($order);

                if (isset($order->store->user)) {
                    $order->store->user->notify(new VendorNewOrderNotification($order));
                }

                if (isset($order->customer)) {
                    $order->customer->notify(new OrderSuccessfulNotification($order));
                }

                Log::info('Order payment processed', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_reference' => $paymentDetails['reference'],
                ]);
            }
        });
    }

    /**
     * Find or create a payment record
     */
    private function findOrCreatePayment(array $paymentDetails, PaymentStatusEnum $status, string $description): Payment
    {
        return Payment::firstOrCreate(
            ['reference' => $paymentDetails['reference']],
            [
                'amount' => $paymentDetails['amount'],
                'currency' => $paymentDetails['currency'],
                'gateway' => PaymentGatewayEnum::PAYSTACK->value,
                'status' => $status->value,
                'description' => $description,
            ]
        );
    }

    /**
     * Create a payment transaction record
     */
    private function createPaymentTransaction(Payment $payment, array $paymentDetails, array $payload, bool $isSuccess, string $statusMessage): void
    {
        PaymentTransaction::create([
            'payment_id' => $payment->id,
            'reference' => $paymentDetails['reference'],
            'type' => PaymentTransactionTypeEnum::CHARGE,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'is_success' => $isSuccess,
            'status_message' => $statusMessage,
            'response_payload' => json_encode($payload),
        ]);
    }

    /**
     * Extracts payment details from the Paystack payload
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
     * Extracts the order ID from the Paystack payload
     */
    private function extractOrderId(array $payload): string
    {
        return $payload['data']['metadata']['order_number'] ?? '';
    }

    /**
     * Extracts the payment type from the Paystack payload
     */
    private function extractPaymentType(array $payload): string
    {
        $type = $payload['data']['metadata']['type'] ?? '';
        return $type;
    }

    /**
     * Process order details and update listing quantities atomically
     */
    private function processOrderDetails(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order->load([
                'orderDetails.listing' => fn($query) => $query->lockForUpdate(),
                'orderDetails.variant'
            ]);

            foreach ($order->orderDetails as $orderDetail) {
                try {
                    $this->updateListingOrVariantQuantity($orderDetail);
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
     * Update the quantity of a listing or variant
     */
    private function updateListingOrVariantQuantity($orderDetail): void
    {
        $listing = $orderDetail->listing;

        if (!$listing) {
            throw new \RuntimeException("Listing not found for order detail {$orderDetail->id}");
        }

        if ($orderDetail->variant_id) {
            $this->handleVariantQuantity($orderDetail);
            return;
        }

        $this->handleListingQuantity($listing, $orderDetail->quantity);
    }

    /**
     * Handle quantity update for a variant
     */
    private function handleVariantQuantity($orderDetail): void
    {
        $variant = $orderDetail->variant;

        if (!$variant) {
            throw new \RuntimeException("Variant not found for order detail {$orderDetail->id}");
        }

        $this->decrementQuantity($variant, $orderDetail->quantity, "variant {$variant->id}");
        $variant->refresh();
    }

    /**
     * Handle quantity update for a listing
     */
    private function handleListingQuantity($listing, int $quantity): void
    {
        $this->decrementQuantity($listing, $quantity, "listing {$listing->id}");
        $listing->refresh();
    }

    /**
     * Decrement the quantity of a model and ensure sufficient stock
     */
    private function decrementQuantity($model, int $quantity, string $identifier): void
    {
        $affectedRows = $model->newQuery()
            ->where('id', $model->id)
            ->where('quantity', '>=', $quantity)
            ->decrement('quantity', $quantity);

        if ($affectedRows === 0) {
            throw new \RuntimeException(
                "Insufficient quantity for {$identifier}. " .
                    "Available: {$model->quantity}, Required: {$quantity}"
            );
        }
    }

    /**
     * Define maximum number of attempts
     */
    public function maxAttempts(): int
    {
        return 5;
    }

    /**
     * Logs the details of a failed payment event
     */
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
