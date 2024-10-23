<?php

namespace App\Jobs;

use App\Enums\PaymentGatewayEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PaymentEventBus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private readonly array $webhookData)
    {
        if (!isset($webhookData['gateway'], $webhookData['event_type'], $webhookData['payload'])) {
            throw new \InvalidArgumentException('Invalid webhook data');
        }

        Log::info('Payment Event Bus Initialized', [
            'gateway' => $webhookData['gateway'],
            'event_type' => $webhookData['event_type']
        ]);
    }

    public function handle(): void
    {
        $gateway = PaymentGatewayEnum::from($this->webhookData['gateway']);
        $eventType = $this->webhookData['event_type'];
        $payload = $this->webhookData['payload'];

        Log::info('Processing Payment Event', [
            'gateway' => $gateway->value,
            'event_type' => $eventType
        ]);

        match ($gateway) {
            PaymentGatewayEnum::PAYPAL => $this->handlePayPalEvent($eventType, $payload),
            PaymentGatewayEnum::STRIPE => $this->handleStripeEvent($eventType, $payload),
            PaymentGatewayEnum::PAYSTACK => $this->handlePaystackEvent($eventType, $payload),
        };
    }

    private function handlePayPalEvent(string $eventType, array $payload): void
    {
     Log::info('PayPal Event Received');

        try {
            match ($eventType) {
                'PAYMENT.CAPTURE.COMPLETED',
                'CHECKOUT.ORDER.APPROVED' => $this->processSuccessfulPayment($payload),
                'PAYMENT.CAPTURE.DECLINED' => $this->processFailedPayment($payload),
                default => Log::warning('Unhandled PayPal event type', ['event_type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('PayPal Event Processing Failed', [
                'event_type' => $eventType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function handleStripeEvent(string $eventType, array $payload): void
    {
        Log::info('Stripe Event Received', [
            'event_type' => $eventType,
            'payload' => $payload
        ]);

        try {
            match ($eventType) {
                'payment_intent.succeeded' => $this->processSuccessfulPayment($payload),
                'payment_intent.payment_failed' => $this->processFailedPayment($payload),
                default => Log::warning('Unhandled Stripe event type', ['event_type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('Stripe Event Processing Failed', [
                'event_type' => $eventType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function handlePaystackEvent(string $eventType, array $payload): void
    {
        Log::info('Paystack Event Received', [
            'event_type' => $eventType,
            'payload' => $payload
        ]);

        try {
            match ($eventType) {
                'charge.success' => $this->processSuccessfulPayment($payload),
                'charge.failed' => $this->processFailedPayment($payload),
                default => Log::warning('Unhandled Paystack event type', ['event_type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('Paystack Event Processing Failed', [
                'event_type' => $eventType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function processSuccessfulPayment(array $payload): void
    {
        $orderId = $this->extractOrderId($payload);
        if (empty($orderId)) {
            Log::warning('Order ID is missing or malformed', ['payload' => $payload]);
        }
        Log::info('Processing Successful Payment', [
            'gateway' => $this->webhookData['gateway'],
            'order_id' => $orderId,
            'payload' => $payload
        ]);
    }

    private function processFailedPayment(array $payload): void
    {
        $orderId = $this->extractOrderId($payload);
        Log::info('Processing Failed Payment', [
            'gateway' => $this->webhookData['gateway'],
            'order_id' => $orderId,
            'payload' => $payload
        ]);

        // Process failed payment logic here
    }

    private function extractOrderId(array $payload): string
    {
        $orderId = match ($this->webhookData['gateway']) {
            PaymentGatewayEnum::PAYPAL => $payload['id'] ?? '',
            PaymentGatewayEnum::STRIPE => $payload['data']['object']['metadata']['order_id'] ?? '',
            PaymentGatewayEnum::PAYSTACK => $payload['data']['metadata']['order_id'] ?? '',
            default => '',
        };

        Log::info('Extracted Order ID', [
            'gateway' => $this->webhookData['gateway'],
            'order_id' => $orderId
        ]);

        return $orderId;
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Payment Event Bus Failed', [
            'gateway' => $this->webhookData['gateway'] ?? 'unknown',
            'event_type' => $this->webhookData['event_type'] ?? 'unknown',
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);

    }
}
