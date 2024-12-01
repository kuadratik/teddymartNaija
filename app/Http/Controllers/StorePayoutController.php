<?php

namespace App\Http\Controllers;

use App\Http\Requests\Store\SavePayoutDetailRequest;
use App\Models\Store;
use App\Models\StorePayoutDetail;
use Illuminate\Http\Request;

class StorePayoutController extends Controller
{

    public function getPayoutDetails(Store $userStore)
    {

        $payoutDetails = StorePayoutDetail::where('store_id', $userStore->id)->get();
        return $this->success($payoutDetails);
    }

    public function savePayoutDetails(SavePayoutDetailRequest $request)
    {
        StorePayoutDetail::create($request->validated());
        return $this->success();
    }

    public function showPayoutDetail(StorePayoutDetail $storePayoutDetail)
    {
        return $this->success($storePayoutDetail);
    }

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

    public function deletePayoutDetail(Store $userStore, StorePayoutDetail $storePayoutDetail)
    {
        $storePayoutDetail->delete();
        return $this->success();
    }
}
