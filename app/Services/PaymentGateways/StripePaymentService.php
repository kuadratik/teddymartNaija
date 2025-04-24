<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use App\Models\StorePayoutDetail;

class StripePaymentService implements PaymentGatewayInterface
{
    public function __construct(private readonly string|null $secretKey)
    {
        //
    }

    public function initialize(array $data): array
    {
        return [];
    }

    public function verify(array $data): array
    {
        return [];
    }

    public function refund(string $reference, float $amount): array
    {
        return [];
    }

    public function transfer(Order $order, StorePayoutDetail $payoutDetail): array
    {
        return [];
    }
    public function validateBankDetails(string $accountNumber, string $bankCode): array
    {
        return [];
    }
    public function createTransferRecipient(string $accountName, string $accountNumber, string $bankCode): array
    {
        return [];
    }

    public function acceptedBanks(?string $search = null, ?string $next = null, ?string $prev = null, int $perPage = 100): array
    {
        return [];
    }
}
