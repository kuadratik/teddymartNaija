<?php

namespace App\Http\Controllers;

use App\Enums\PaymentGatewayEnum;
use Illuminate\Http\Request;
use App\Jobs\PaymentEventBus;


class WebhookController extends Controller
{

    public function handleWebhook(Request $request, PaymentGatewayEnum $gateway)
    {
        $payload = $request->all();

        PaymentEventBus::dispatch([
            'gateway' => $gateway,
            'event_type' => $this->getEventType($gateway, $payload),
            'payload' => $payload,
        ]);

        return response()->json(['message' => 'Webhook received']);
    }

    private function getEventType(PaymentGatewayEnum $gateway, array $payload): string
    {
        return match ($gateway) {
            PaymentGatewayEnum::PAYPAL => $payload['event_type'] ?? '',
            PaymentGatewayEnum::STRIPE => $payload['type'] ?? '',
            PaymentGatewayEnum::PAYSTACK => $payload['event'] ?? '',
        };
    }
}
