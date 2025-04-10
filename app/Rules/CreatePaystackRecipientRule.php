<?php

namespace App\Rules;

use App\Enums\PaymentGatewayEnum;
use App\Enums\PayoutDetailType;
use App\Models\Payment;
use App\Services\PaymentGateways\PaymentService;
use App\Services\PaymentGateways\PaystackPaymentService;
use Illuminate\Contracts\Validation\ValidationRule;

class CreatePaystackRecipientRule implements ValidationRule
{
    private string $detailType;
    private string $errorMessage = 'Failed to create Paystack recipient.';
    private string $gateway = PaymentGatewayEnum::PAYSTACK->value;

    public function __construct(string $detailType)
    {
        $this->detailType = $detailType;
    }

    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if ($this->detailType === PayoutDetailType::INTERNATION->value) {
            return;
        }

        $paymentService = app(PaymentService::class);
        $response = $paymentService->gateway($this->gateway)->createTransferRecipient(
            request('account_name'),
            request('account_number'),
            request('bank_code')
        );

        if (!$response['status']) {
            $fail($response['message'] ?? $this->errorMessage);
        } else {
            request()->merge(['paystack_recipient_code' => $response['data']['recipient_code']]);
        }
    }
}
