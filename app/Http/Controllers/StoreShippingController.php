<?php

namespace App\Http\Controllers;

use App\Enums\ShippingMethodEnum;
use App\Http\Requests\Store\SaveShippingMethodRequest;
use App\Models\Store;
use App\Models\StoreShippingMethod;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreShippingController extends Controller
{
    /**
     * Fetch shipping methods
     */
    public function getShippingMethods(Request $request, Store $userStore)
    {

        abort_if(
            !Store::find($userStore->id)->byUser($request->user()->id)->exists(),
            403,
            'You are only allowed to get shipping methods for your stores.'
        );

        $storeShippingMethods = StoreShippingMethod::where('store_id', $userStore->id)->get();
        $groupedMethods = $storeShippingMethods->groupBy('method_type');
        $storeMethodTypes = $groupedMethods->keys();

        $storeShippingMethods = collect([
            'storeMethodTypes' => $storeMethodTypes,
            'storeMethods' => $groupedMethods
        ])->toArray();

        return $this->success($storeShippingMethods);
    }

    /**
     * Saves a store shipping methods
     */
    public function saveShippingMethod(SaveShippingMethodRequest $request)
    {
        $request->saveMethod();
        return $this->success();
    }

    /**
     * Remove specific method type
     */
    public function removeMethodType(Request $request)
    {
        $validatedData = $request->validate(
            [
                'store_id' => ['required', Rule::exists('stores', 'id')->where('user_id', $request->user()->id)],
                'method_type' => ['required', new Enum(ShippingMethodEnum::class)]
            ]
        );

        StoreShippingMethod::where([
            'method_type'  => $validatedData['method_type'],
            'store_id' => $validatedData['store_id']
        ])->delete();

        return $this->success();
    }

    /**
     * Delete store shipping method
     */
    public function deleteShippingMethod(StoreShippingMethod $shippingMethod, Request $request)
    {

        if ($shippingMethod->method_type === ShippingMethodEnum::STORE_PICK_UP->value) {
            return $this->failure('Store pick-up details can not be deleted!', 403);
        }

        if (Store::find($shippingMethod->store_id)->byUser($request->user()->id)->exists()) {

            $shippingMethod->delete();
            return $this->success();
        }
    }
}
