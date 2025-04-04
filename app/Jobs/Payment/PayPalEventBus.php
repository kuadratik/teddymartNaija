<?php

namespace App\Jobs\Payment;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\PaymentTransactionTypeEnum;
use App\Enums\PaymentType;
use App\Models\AdvertListingPromotePlan;
use App\Models\Cart;
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

class PayPalEventBus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(public array $webhookData) {}

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
     * Process a payment event based on payment type
     */
    private function processPaymentEvent(array $payload, string $eventStatus): void
    {
        $orderId = $this->extractOrderId($payload);
        $paymentType = $this->extractPaymentType($payload);

        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed');
            return;
        }

        if (empty($paymentType)) {
            Log::warning('Payment type is missing or malformed');
            return;
        }

        $paymentDetails = $this->extractPaymentDetails($payload);
        $isSuccess = in_array($eventStatus, ['COMPLETED', 'APPROVED']);
        $paymentStatus = $isSuccess ? PaymentStatusEnum::SUCCESS : PaymentStatusEnum::FAILED;
        $orderStatus = $isSuccess ? OrderStatusEnum::ACTIVE : OrderStatusEnum::PAYMENT_FAILED;
        $orderPaymentStatus = $isSuccess ? OrderStatusEnum::COMPLETED_PAYMENT : OrderStatusEnum::PAYMENT_FAILED;

        try {
            match ($paymentType) {
                PaymentType::ADVERT->value => $this->processAdvertPayment($orderId, $paymentDetails, $payload, $paymentStatus, $orderStatus, $eventStatus),
                PaymentType::PROMOTION->value => $this->processPromotionPayment($orderId, $paymentDetails, $payload, $paymentStatus, $orderStatus, $eventStatus),
                default => $this->processOrderPayment($orderId, $paymentDetails, $payload, $paymentStatus, $orderPaymentStatus, $eventStatus),
            };
        } catch (\Exception $e) {
            Log::error("Failed to process {$eventStatus} payment", [
                'order_id' => $orderId,
                'payment_type' => $paymentType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Process a completed payment
     */
    private function processCompletedPayment(array $payload): void
    {
        $this->processPaymentEvent($payload, 'COMPLETED');
    }

    /**
     * Process an approved payment
     */
    private function processApprovedPayment(array $payload): void
    {
        $this->processPaymentEvent($payload, 'APPROVED');
    }

    /**
     * Process a failed payment
     */
    private function processFailedPayment(array $payload): void
    {
        $this->processPaymentEvent($payload, 'FAILED');
    }

    /**
     * Process advertisement payment
     */
    private function processAdvertPayment(string $orderId, array $paymentDetails, array $payload, PaymentStatusEnum $paymentStatus, OrderStatusEnum $orderStatus, string $eventStatus): void
    {
        $advert = AdvertListingPromotePlan::where('order_number', $orderId)->with('advertListing')->first();

        if (!$advert) {
            Log::error('No advert listing promotion found', ['order_number' => $orderId]);
            return;
        }

        DB::transaction(function () use ($advert, $paymentDetails, $payload, $paymentStatus, $orderStatus, $eventStatus) {
            $payment = $this->findOrCreatePayment($paymentDetails, $paymentStatus, 'PayPal Payment for ads');

            if ($orderStatus === OrderStatusEnum::ACTIVE && $advert->status === OrderStatusEnum::ACTIVE->value && $advert->payment_id === $payment->id) {
                Log::info('Advert is already active, skipping update.', ['order_number' => $advert->order_number]);
                return;
            }

            if ($orderStatus === OrderStatusEnum::ACTIVE) {
                $advert->status = $orderStatus->value;
                $advert->started_at = now();
                $advert->expires_at = now()->addDays($advert->advertPromotePlan->duration_days);
                $advert->payment_id = $payment->id;
            } else {
                $advert->status = $orderStatus->value;
                $advert->failure_reason = $paymentDetails['failure_reason'] ?? null;
            }

            $advert->save();

            $this->createPaymentTransaction($payment, $paymentDetails, $payload, $eventStatus !== 'FAILED', $eventStatus);

            if ($orderStatus === OrderStatusEnum::ACTIVE && isset($advert->advertListing->user)) {
                $advert->advertListing->user->notify(new AdvertSuccessNotification($advert->advertListing));
            }
        });
    }

    /**
     * Process store promotion payment
     */
    private function processPromotionPayment(string $orderId, array $paymentDetails, array $payload, PaymentStatusEnum $paymentStatus, OrderStatusEnum $orderStatus, string $eventStatus): void
    {
        $promotion = StorePromotePlanStore::where('order_number', $orderId)->first();

        if (!$promotion) {
            Log::error('No store promotion found', ['order_number' => $orderId]);
            return;
        }

        DB::transaction(function () use ($promotion, $paymentDetails, $payload, $paymentStatus, $orderStatus, $eventStatus) {
            $payment = $this->findOrCreatePayment(
                $paymentDetails,
                $paymentStatus,
                'PayPal Payment for promotion'
            );

            // Skip update if already processed
            if (
                $orderStatus === OrderStatusEnum::ACTIVE &&
                $promotion->status === OrderStatusEnum::ACTIVE->value &&
                $promotion->payment_id === $payment->id
            ) {
                Log::info('Promotion is already active, skipping update.', ['order_number' => $promotion->order_number]);
                return;
            }

            if ($orderStatus === OrderStatusEnum::ACTIVE) {
                $promotion->status = $orderStatus->value;
                $promotion->started_at = now();
                $promotion->expires_at = now()->addDays($promotion->storePromotePlan->duration_days);
                $promotion->payment_id = $payment->id;
            } else {
                $promotion->status = $orderStatus->value;
                $promotion->failure_reason = $paymentDetails['failure_reason'] ?? null;
            }
            $promotion->save();

            $this->createPaymentTransaction($payment, $paymentDetails, $payload, $eventStatus !== 'FAILED', $eventStatus);
        });
    }

    /**
     * Process order payment
     */
    private function processOrderPayment(string $orderId, array $paymentDetails, array $payload, PaymentStatusEnum $paymentStatus, OrderStatusEnum $orderPaymentStatus, string $eventStatus): void
    {
        $orders = Order::where('order_number', $orderId)->with(['orderDetails.listing'])->get();

        if ($orders->isEmpty()) {
            Log::error('No orders found', ['order_number' => $orderId]);
            return;
        }

        DB::transaction(function () use ($orders, $paymentDetails, $payload, $paymentStatus, $orderPaymentStatus, $eventStatus) {
            $payment = $this->findOrCreatePayment(
                $paymentDetails,
                $paymentStatus,
                'PayPal Payment'
            );

            $orderNumbers = $orders->pluck('order_number')->toArray();
            $enhancedPayload = array_merge($payload, [
                'additional_data' => ['order_numbers' => $orderNumbers],
            ]);

            $isSuccess = $eventStatus !== 'FAILED';
            $orderStatus = $isSuccess ? OrderStatusEnum::NEW : OrderStatusEnum::PENDING;

            foreach ($orders as $order) {
                if ($isSuccess && $order->payment_status == OrderStatusEnum::COMPLETED_PAYMENT) {
                    Log::warning('Skipping order - Invalid state transition', [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'current_status' => $order->payment_status,
                    ]);
                    continue;
                }

                if (!$order->payments()->where('payment_id', $payment->id)->exists()) {
                    $order->payments()->attach($payment->id);
                }

                $order->payment_status = $orderPaymentStatus->value;
                $order->status = $orderStatus->value;


                if (!$isSuccess) {
                    $order->failure_reason = $paymentDetails['failure_reason'] ?? 'Unknown error';
                }

                $order->save();
                Cart::whereNotNull('user_id')
                    ->where('user_id', $order->user_id)
                    ->delete();

                if ($orderPaymentStatus === OrderStatusEnum::COMPLETED_PAYMENT) {
                    $this->processOrderDetails($order);
                }

                if ($isSuccess) {
                    $order->store->user->notify(new VendorNewOrderNotification($order));
                    $order->customer->notify(new OrderSuccessfulNotification($order));
                } elseif (isset($order->customer)) {
                    $order->customer->notify(new OrderPaymentFailedNotification($order));
                }
            }

            $this->createPaymentTransaction($payment, $paymentDetails, $enhancedPayload, $isSuccess, $eventStatus);
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
                'gateway' => PaymentGatewayEnum::PAYPAL->value,
                'status' => $status->value,
                'description' => $description,
            ]
        );
    }

    /**
     * Create a payment transaction record
     */
    private function createPaymentTransaction(Payment $payment,  array $paymentDetails, array $payload,   bool $isSuccess, string $statusMessage): void
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
     * Extracts payment details from the given payload array
     */
    private function extractPaymentDetails(array $payload): array
    {
        $purchaseUnit = $payload['resource']['purchase_units'][0] ?? [];
        $resource = $payload['resource'] ?? [];

        return [
            'reference' => $resource['id'] ?? '',
            'amount' => $resource['amount']['value'] ?? $purchaseUnit['amount']['value'] ?? null,
            'currency' => $resource['amount']['currency_code'] ?? $purchaseUnit['amount']['currency_code'] ?? null,
            'status_message' => $resource['status'] ?? 'FAILED',
            'failure_reason' => $resource['status_details']['reason'] ?? 'Unknown error',
        ];
    }

    /**
     * Extracts the order ID from the provided payload array
     */
    private function extractOrderId(array $payload): string
    {
        $customId = $payload['resource']['purchase_units'][0]['custom_id'] ?? $payload['resource']['custom_id'] ?? '';
        $customData = json_decode($customId, true);

        return $customData['order_number'] ?? '';
    }

    /**
     * Extracts the payment type from the provided payload array
     */
    private function extractPaymentType(array $payload): string
    {
        $customId = $payload['resource']['purchase_units'][0]['custom_id'] ?? $payload['resource']['custom_id'] ?? '';
        $customData = json_decode($customId, true);

        return $customData['type'] ?? '';
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
     * Logs the details of a failed payment event
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
