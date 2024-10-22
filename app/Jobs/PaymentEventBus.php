<?php

namespace App\Jobs;

use App\Enums\PaymentGatewayEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PaymentEventBus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private readonly array $webhookData) {}

    /**
     * Handles different payment gateway events based on the gateway type.
     */
    public function handle(): void
    {
        $gateway = PaymentGatewayEnum::from($this->webhookData['gateway']);
        $eventType = $this->webhookData['event_type'];
        $payload = $this->webhookData['payload'];

        match ($gateway) {
            PaymentGatewayEnum::PAYPAL => $this->handlePayPalEvent($eventType, $payload),
            PaymentGatewayEnum::STRIPE => $this->handleStripeEvent($eventType, $payload),
            PaymentGatewayEnum::PAYSTACK => $this->handlePaystackEvent($eventType, $payload),
        };
    }

    /**
     * Handles PayPal specific events for successful and failed payments.
     */
    private function handlePayPalEvent(string $eventType, array $payload): void
    {
        match ($eventType) {
            'PAYMENT.CAPTURE.COMPLETED' => $this->processSuccessfulPayment($payload),
            'PAYMENT.CAPTURE.DECLINED' => $this->processFailedPayment($payload),
            default => null,
        };
    }

    /**
     * Handles Stripe specific events for successful and failed payments.
     */
    private function handleStripeEvent(string $eventType, array $payload): void
    {
        match ($eventType) {
            'payment_intent.succeeded' => $this->processSuccessfulPayment($payload),
            'payment_intent.payment_failed' => $this->processFailedPayment($payload),
            default => null,
        };
    }

    /**
     * Handles Paystack specific events for successful and failed payments.
     */
    private function handlePaystackEvent(string $eventType, array $payload): void
    {
        match ($eventType) {
            'charge.success' => $this->processSuccessfulPayment($payload),
            'charge.failed' => $this->processFailedPayment($payload),
            default => null,
        };
    }

    /**
     * Process a successful payment event for a specific payment gateway.
     */
    private function processSuccessfulPayment(array $payload): void
    {

        $orderId = $this->extractOrderId($payload);
    }

    /**
     * Process a failed payment event for a specific payment gateway.
     */
    private function processFailedPayment(array $payload): void
    {

        $orderId = $this->extractOrderId($payload);
    }

    /**
     * Extracts the order ID from the provided payload based on the payment gateway type.
     */
    private function extractOrderId(array $payload): string
    {
        return match ($this->webhookData['gateway']) {
            PaymentGatewayEnum::PAYPAL => $payload['resource']['custom_id'] ?? '',
            PaymentGatewayEnum::STRIPE => $payload['data']['object']['metadata']['order_id'] ?? '',
            PaymentGatewayEnum::PAYSTACK => $payload['data']['metadata']['order_id'] ?? '',
        };
    }
}
