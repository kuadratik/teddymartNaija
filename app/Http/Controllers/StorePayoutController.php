<?php

namespace App\Http\Controllers;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Http\Requests\Store\SavePayoutDetailRequest;
use App\Models\Order;
use App\Models\Store;
use App\Models\StorePayoutDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        StorePayoutDetail::create($request->validated());
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
}
