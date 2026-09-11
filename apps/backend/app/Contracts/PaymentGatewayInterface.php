<?php

namespace App\Contracts;

use App\Models\Order;
use App\Models\StorePayoutDetail;

interface PaymentGatewayInterface
{
    public function initialize(array $data): array;
    public function verify(array $data): array;
    public function refund(string $reference, float $amount): array;
    public function transfer(Order $order, StorePayoutDetail $payoutDetail): array;
    public function validateBankDetails(string $accountNumber, string $bankCode): array;
    public function createTransferRecipient(string $accountName, string $accountNumber, string $bankCode): array;
    public function acceptedBanks(?string $search, ?string $next, ?string $prev, int $perPage);
}
