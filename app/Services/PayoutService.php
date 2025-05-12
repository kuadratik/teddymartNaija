<?php

namespace App\Services;

use App\Enums\CurrencyCodeEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Models\Order;
use App\Models\Store;
use App\Models\StorePayoutDetail;
use App\Models\Otp;
use App\Models\Payout;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Notifications\SendOtpNotification;
use App\Services\PaymentGateways\PaymentService;
use Illuminate\Validation\ValidationException;

class PayoutService
{
    public function __construct(private readonly PaymentService $paymentService) {}
    public function getRequestPayoutOrders(Store $userStore)
    {
        return $userStore->orders()->payoutable()->paginate(20);
    }

    public function getProcessedPayouts(Store $userStore)
    {
        return $userStore->orders()->paidPayouts()->paginate(20);
    }

    public function processPayout(Store $userStore, Order $order)
    {
        $userStore->load('defaultPayoutDetail');
        DB::transaction(function () use ($userStore, $order) {
            if ($userStore->payoutDetails()->doesntExist()) {
                throw ValidationException::withMessages([
                    'payout' => ['To proceed, please fill your payout information']
                ]);
            }

            if (!$userStore->defaultPayoutDetail) {
                throw ValidationException::withMessages([
                    'payout' => ['Default payout information is required.']
                ]);
            }




            if ($order->status !== OrderStatusEnum::DELIVERED->value) {
                throw ValidationException::withMessages([
                    'payout' => ['Order  must be complete to process payout']
                ]);
            }

            if ($order->payout_status == OrderStatusEnum::PROCESSING->value) {
                throw ValidationException::withMessages([
                    'payout' => ['Payout is already processing']
                ]);
            }

            Payout::create([
                'reference' => $order->uid,
                'order_id' => $order->id,
                'store_id' => $userStore->id,
                'amount' => $order->payoutAmount,
                'currency' => $order->currency,
                'status' => OrderStatusEnum::PROCESSING,
                'provider' => $order->currency == CurrencyCodeEnum::NGN->value ? PaymentGatewayEnum::PAYSTACK : null,
            ]);

            if ($order->currency == CurrencyCodeEnum::NGN->value) {
                throw_if(!$userStore->defaultPayoutDetail->bank_code, ValidationException::withMessages([
                    'payout' => ['Payout is already processing']
                ]), 'bank code is required to process payout delete bank and recreate');
                $this->paymentService->gateway(PaymentGatewayEnum::PAYSTACK->value)->transfer($order, $userStore->defaultPayoutDetail);
            }

            $order->update(['payout_status' => OrderStatusEnum::PROCESSING]);
        });
    }

    public function getPayoutDetails(Store $userStore)
    {
        return StorePayoutDetail::where('store_id', $userStore->id)->get();
    }

    public function savePayoutDetails(array $payoutAttributes)
    {
        StorePayoutDetail::create($payoutAttributes);
    }

    public function updatePayoutDetail(StorePayoutDetail $storePayoutDetail, array $validatedData)
    {
        $storePayoutDetail->update($validatedData);
    }

    public function setDefaultPayoutDetail(Store $userStore, StorePayoutDetail $storePayoutDetail)
    {
        DB::transaction(function () use ($userStore, $storePayoutDetail) {
            StorePayoutDetail::where('store_id', $userStore->id)->update(['is_default' => false]);
            $storePayoutDetail->update(['is_default' => true]);
        });
    }

    public function deletePayoutDetail(StorePayoutDetail $storePayoutDetail)
    {
        $storePayoutDetail->delete();
    }

    public function sendPayoutDetailsOtp($user)
    {
        $otp = random_int(100000, 999999);
        Otp::updateOrCreate(
            ['email' => $user->email],
            [
                'otp' => Hash::make($otp),
                'expires_at' => now()->addMinutes(5),
                'is_used' => false,
            ]
        );

        $user->notify(new SendOtpNotification($otp));
    }

    public function verifyPayoutDetailsOtp($user)
    {
        $otpRecord = Otp::where('email', $user->email)->first();
        $otpRecord->update(['is_used' => true]);
    }
}
