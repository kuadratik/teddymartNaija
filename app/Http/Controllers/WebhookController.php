<?php

namespace App\Http\Controllers;

use App\Enums\PaymentGatewayEnum;
use App\Jobs\Payment\PayPalEventBus;
use App\Jobs\Payment\PaystackEventBus;
use App\Jobs\Payment\StripeEventBus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handles incoming webhooks for different payment gateways.
     */
    public function handleWebhook(Request $request, PaymentGatewayEnum $gateway)
    {
        $payload = $request->all();
        $eventType = $this->getEventType($gateway, $payload);
        $webhookData = [
            'gateway' => $gateway,
            'event_type' => $eventType,
            'payload' => $payload,
        ];
        $this->dispatchGatewayBus($gateway, $webhookData);
        return response()->json(['message' => 'Webhook received']);
    }

    /**
     * Dispatches the appropriate event bus based on the payment gateway and webhook data.
     */
    private function dispatchGatewayBus(PaymentGatewayEnum $gateway, array $webhookData): void
    {
        $bus = match ($gateway) {
            PaymentGatewayEnum::PAYPAL => new PayPalEventBus($webhookData),
            PaymentGatewayEnum::STRIPE => new StripeEventBus($webhookData),
            PaymentGatewayEnum::PAYSTACK => new PaystackEventBus($webhookData),
        };

        dispatch($bus);

        Log::info('Payment webhook dispatched', [
            'gateway' => $gateway->value,
            'event_type' => $webhookData['event_type']
        ]);
    }

    /**
     * Get the event type based on the payment gateway and payload.
     */
    private function getEventType(PaymentGatewayEnum $gateway, array $payload): string
    {
        return match ($gateway) {
            PaymentGatewayEnum::PAYPAL => $payload['event_type'] ?? '',
            PaymentGatewayEnum::STRIPE => $payload['type'] ?? '',
            PaymentGatewayEnum::PAYSTACK => $payload['event'] ?? '',
        };
    }
}
