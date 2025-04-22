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
}
