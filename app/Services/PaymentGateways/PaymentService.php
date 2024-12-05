<?php

namespace App\Services\PaymentGateways;

use App\Contracts\PaymentGatewayInterface;
use InvalidArgumentException;

class PaymentService
{
    public function __construct(private readonly array $gateways)
    {
        //
    }

     /**
     * Retrieve a payment gateway by its name.
     *
     * @param string $name The name of the payment gateway to retrieve.
     * @return PaymentGatewayInterface The payment gateway instance associated with the given name.
     * @throws InvalidArgumentException If the specified payment gateway is not supported.
     */
    public function gateway(string $name): PaymentGatewayInterface
    {
        if (!isset($this->gateways[$name])) {
            throw new InvalidArgumentException("Payment gateway [{$name}] is not supported.");
        }

        return $this->gateways[$name];
    }
}
