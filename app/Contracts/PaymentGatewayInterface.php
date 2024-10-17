<?php

namespace App\Contracts;

interface PaymentGatewayInterface
{
    public function initialize(array $data): array;
    public function verify(string $reference): array;
    public function refund(string $reference, float $amount): array;
}
