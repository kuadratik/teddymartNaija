<?php

namespace App\Http\Controllers;

use App\Http\Requests\Store\SavePayoutDetailRequest;
use App\Http\Requests\Store\VerifyOtpRequest;
use App\Models\Order;
use App\Models\Store;
use App\Models\StorePayoutDetail;
use App\Services\PayoutService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class StorePayoutController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected PayoutService $payoutService) {}

    public function getRequestPayoutOrders(Store $userStore)
    {
        $this->authorize('view', $userStore);
        $deliverdOrders = $this->payoutService->getRequestPayoutOrders($userStore);
        return $this->success($deliverdOrders);
    }

    public function getProcessedPayouts(Store $userStore)
    {
        $this->authorize('view', $userStore);
        $orders = $this->payoutService->getProcessedPayouts($userStore);
        return $this->success($orders);
    }

    public function processPayout(Request $request, Store $userStore, Order $order)
    {
        $this->authorize('view', $userStore);
        $this->payoutService->processPayout($userStore, $order);
        return $this->success();
    }

    public function getPayoutDetails(Store $userStore)
    {
        $payoutDetails = $this->payoutService->getPayoutDetails($userStore);

        return $this->success($payoutDetails);
    }

    public function savePayoutDetails(SavePayoutDetailRequest $request)
    {
        $this->payoutService->savePayoutDetails($request->payoutAttributes());

        return $this->success();
    }

    public function updatePayoutDetail(Request $request, Store $userStore, StorePayoutDetail $storePayoutDetail)
    {
        $validatedData = $request->validate([
            'bank_name' => ['required', 'string'],
            'account_name' => ['required', 'string'],
            'account_number' => ['required'],
        ]);

        $this->payoutService->updatePayoutDetail($storePayoutDetail, $validatedData);

        return $this->success();
    }

    public function setDefaultPayoutDetail(Store $userStore, StorePayoutDetail $storePayoutDetail)
    {
        $this->payoutService->setDefaultPayoutDetail($userStore, $storePayoutDetail);

        return $this->success();
    }

    public function deletePayoutDetail(Store $userStore, StorePayoutDetail $storePayoutDetail)
    {
        $this->payoutService->deletePayoutDetail($storePayoutDetail);

        return $this->success();
    }

    public function sendPayoutDetailsOtp(Request $request, Store $userStore)
    {
        $this->authorize('view', $userStore);

        $this->payoutService->sendPayoutDetailsOtp($request->user());

        return $this->success([], 'OTP sent successfully.');
    }

    public function verifyPayoutDetailsOtp(VerifyOtpRequest $request, Store $userStore)
    {
        $this->authorize('view', $userStore);

        $this->payoutService->verifyPayoutDetailsOtp($request->user());

        return $this->success([], 'OTP verified successfully.');
    }
}
