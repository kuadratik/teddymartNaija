<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use InvalidArgumentException;

class PaymentService
{
public function __construct(private readonly array $gateways)
{
}

public function gateway(string $name): PaymentGatewayInterface
{
if (!isset($this->gateways[$name])) {
throw new InvalidArgumentException("Payment gateway [{$name}] is not supported.");
}

return $this->gateways[$name];
}
}
