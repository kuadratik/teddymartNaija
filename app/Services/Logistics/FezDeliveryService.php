<?php

namespace App\Services\Logistics;

use Illuminate\Support\Facades\Http;

class FezDeliveryService
{
    protected string $apiUrl;
    protected array $headers;

    public function __construct()
    {
        $this->apiUrl = config('services.fez_delivery.api_url');
        $this->headers = [
            'Authorization' => cache()->remember(
                'fez_delivery_auth_token',
                now()->parse(
                    $this->authenticate(config('services.fez_delivery.user_id'), config('services.fez_delivery.password'))['expireToken'] ?? now()->addDay()
                )->diffInSeconds(),
                fn() => $this->authenticate(config('services.fez_delivery.user_id'), config('services.fez_delivery.password'))['authToken'] ?? ''
            ),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];
    }

    public function authenticate(string $userId, string $password): ?array
    {
        logger("Authenticating with Fez Delivery API for user: {$userId} {$password}");
        $response = Http::post("{$this->apiUrl}/v1/user/authenticate", [
            'user_id' => $userId,
            'password' => $password,
        ]);

        if ($response->failed()) {
            throw new \Exception('Fez Delivery authentication failed: ' . $response->body());
        }

        $data = $response->json();

        return $data['authDetails'] ?? null;
    }

    public function calculateDeliveryCost(string $state, ?float $weight = null): float
    {
        $payload = ['state' => $state];

        if ($weight !== null) {
            $payload['weight'] = $weight;
        }

        $response = Http::withHeaders($this->headers)
            ->post("{$this->apiUrl}/v1/order/cost", $payload);

        if ($response->failed()) {
            throw new \Exception('Fez Delivery API request failed: ' . $response->body());
        }

        $data = $response->json();

        return (float) ($data['cost'] ?? $data['price'] ?? $data['amount'] ?? 0);
    }
}
