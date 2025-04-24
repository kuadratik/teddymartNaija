<?php

namespace App\Http\Controllers;

use App\Enums\PaymentGatewayEnum;
use App\Http\Requests\Cart\StoreOrderRequest;
use App\Http\Requests\Payment\VerifyPaymentRequest;
use App\Models\Cart;
use App\Services\CartService;
use App\Services\PaymentGateways\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{


    public function __construct(private readonly PaymentService $paymentService, public CartService $cartService)
    {
        //
    }

    /**
     * Process the payment for the order.
     */
    public function payOrder(StoreOrderRequest $request, Cart $cart)
    {
        $paymentData = $this->cartService->getOrderPaymentData($request, $cart);
        $res = $this->paymentService->gateway($request->validated('payment_gateway'))->initialize($paymentData);
        return $this->success($res);
    }


    public function verifyPayment(VerifyPaymentRequest $request, PaymentGatewayEnum $gateway)
    {

        $attr = $request->validated();
        $res = $this->paymentService->gateway($gateway->value)->verify($attr);
        return $this->success($res);
    }


    /**
     * Get payment acceptable banks
     */
    public function getPaymentBanks(Request $request)
    {
        $search = $request->query('search');
        $next = $request->query('next');
        $prev = $request->query('prev');
        $perPage = $request->query('per_page', 100);

        $banks = $this->paymentService
            ->gateway($request->query('payment_gateway', PaymentGatewayEnum::PAYSTACK->value))
            ->acceptedBanks($search, $next, $prev, $perPage);

        return $this->success($banks);
    }


    /**
     * Validate bank details
     */
    public function validateBankDetails(Request $request)
    {
        $request->validate([
            'account_number' => 'required|string',
            'bank_code' => 'required|string',
        ]);

        $res = $this->paymentService
            ->gateway($request->query('payment_gateway', PaymentGatewayEnum::PAYSTACK->value))
            ->validateBankDetails($request->account_number, $request->bank_code);

        return $this->success($res['data']);
    }
}
