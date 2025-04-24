<?php

namespace App\Rules;

use App\Enums\PaymentGatewayEnum;
use App\Enums\PayoutDetailType;
use App\Services\PaymentGateways\PaymentService;
use App\Services\PaymentGateways\PaystackPaymentService;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidateBankDetailsRule implements ValidationRule
{
    private string $bankCode;
    private string $detailType;
    private string $errorMessage = 'Invalid bank details.';
    private string $gateway = PaymentGatewayEnum::PAYSTACK->value;

    public function __construct(string $bankCode, string $detailType)
    {
        $this->bankCode = $bankCode;
        $this->detailType = $detailType;
    }

    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if ($this->detailType === PayoutDetailType::INTERNATION->value) {
            return;
        }

        $paymentService = app(PaymentService::class);
        $response = $paymentService->gateway($this->gateway)->validateBankDetails($value, $this->bankCode);
        if (!$response['status']) {
            $fail($response['message'] ?? $this->errorMessage);
        }
    }
}
