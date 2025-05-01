<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Http\Requests\Store\SavePayoutDetailRequest;
use App\Http\Requests\Store\VerifyOtpRequest;
use App\Models\Order;
use App\Models\Store;
use App\Models\StorePayoutDetail;
use App\Models\Otp;
use App\Rules\ValidOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Notifications\SendOtpNotification;

class StorePayoutController extends Controller
{
    /**
     *  Get requestable payout orders
     */
    public function getRequestPayoutOrders(Request $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $request->user()->id, 403);
        $deliverdOrders = $userStore->orders()->payoutable()->paginate(20);

        return $this->success($deliverdOrders);
    }

    /**
     *  Get processed payout orders
     */
    public function getProcessedPayouts(Request $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $request->user()->id, 403);
        $orders = $userStore->orders()->paidPayouts()->paginate(20);

        return $this->success($orders);
    }

    /**
     *  Process payout orders
     */
    public function processPayout(Request $request, Store $userStore, Order $order)
    {
        abort_if($userStore->user_id !== $request->user()->id, 403);
        abort_if($userStore->payoutDetails()->doesntExist(), 422, 'To proceed , please fill your payout information');
        abort_if($order->status !== OrderStatusEnum::COMPLETED->value, 422, 'Order status must be COMPLETED to process payout');
        $order->update(['payout_status' => OrderStatusEnum::PROCESSING->value]);
        return $this->success();
    }

    /**
     *  Get payout details
     */
    public function getPayoutDetails(Store $userStore)
    {
        $payoutDetails = StorePayoutDetail::where('store_id', $userStore->id)->get();
        return $this->success($payoutDetails);
    }

    /**
     *  Save payout details
     */
    public function savePayoutDetails(SavePayoutDetailRequest $request)
    {
        StorePayoutDetail::create($request->payoutAttributes());
        return $this->success();
    }




    /**
     *  Show payout detail
     */
    public function showPayoutDetail(StorePayoutDetail $storePayoutDetail)
    {
        return $this->success($storePayoutDetail);
    }

    /**
     *  Update payout details
     */
    public function updatePayoutDetail(
        Request $request,
        Store $userStore,
        StorePayoutDetail $storePayoutDetail
    ) {

        $validatedData = $request->validate([
            'bank_name' => ['required', 'string'],
            'account_name' => ['required', 'string'],
            'account_number' => ['required']
        ]);

        $storePayoutDetail->update($validatedData);
        return $this->success();
    }

    /**
     *  Set default payout detail
     */
    public function setDefaultPayoutDetail(Store $userStore, StorePayoutDetail $storePayoutDetail)
    {

        DB::transaction(function () use ($userStore, $storePayoutDetail) {

            StorePayoutDetail::where('store_id', $userStore->id)->update([
                'is_default' => false
            ]);

            $storePayoutDetail->update(['is_default' => true]);
        });

        return $this->success();
    }

    /**
     *  Delete payout detail
     */
    public function deletePayoutDetail(Store $userStore, StorePayoutDetail $storePayoutDetail)
    {
        $storePayoutDetail->delete();
        return $this->success();
    }


    /**
     * Sends OTP to user's email for payout details verification
     */
    public function sendPayoutDetailsOtp(Request $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $request->user()->id, 403);

        $otp = random_int(100000, 999999);
        Otp::updateOrCreate(
            ['email' => $request->user()->email],
            [
                'otp' => Hash::make($otp),
                'expires_at' => now()->addMinutes(5),
                'is_used' => false,
            ]
        );

        $request->user()->notify(new SendOtpNotification($otp));

        return $this->success([], 'OTP sent successfully.');
    }

    /**
     * Verify OTP for store payout details
     */
    public function verifyPayoutDetailsOtp(VerifyOtpRequest $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $request->user()->id, 403);

        $otpRecord = Otp::where('email', $request->user()->email)->first();
        $otpRecord->update(['is_used' => true]);

        return $this->success([], 'OTP verified successfully.');
    }
}
