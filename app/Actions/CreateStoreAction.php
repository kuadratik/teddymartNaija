<?php

namespace App\Actions;

use App\Enums\CurrencyType;
use App\Enums\GeneralEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentType;
use App\Models\Country;
use App\Models\Store;
use App\Services\PaymentGateways\PaymentService;
use App\Support\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateStoreAction
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected PaymentService $paymentService)
    {
        //
    }

    /**
     * Prepare store record to save
     */
    public function execute($validated)
    {
        $request = request();
        $country = Country::find($validated['country_id']);
        $step = strval($request->route()->parameter('step'));
        $storeId = data_get($validated, 'id');
        $user = $request->user();
        $currency = $country?->currency_code ?? CurrencyType::USD;

        $gateway = in_array($currency, CurrencyType::foreignCurrency())
            ? PaymentGatewayEnum::STRIPE->value : PaymentGatewayEnum::PAYSTACK->value;

        $payload = collect($validated)
            ->except([
                'id',
                'profile_picture_path',
                'offers_service',
                'offers_product',
                'banner_path',
                'country',
                'categories',
                'return_url',
                'cancel_url'
            ])
            ->merge([
                'banner_path' => data_get($validated, 'banner_path') ? Utils::moveToPermanentPath([$validated['banner_path']], 'images')[0] : null,
                'profile_picture_path' => data_get($validated, 'profile_picture_path') ? Utils::moveToPermanentPath([$validated['profile_picture_path']], 'images')[0] : null,
                'country_id' => $validated['country_id'],
                'currency' => $currency,
                'step' => $step,
                'fee_amount' => $gateway == PaymentGatewayEnum::STRIPE->value ? 5 : 5000
            ])->toArray();

        try {
            DB::beginTransaction();
            $store = Store::firstOrNew(['id' => $storeId, 'user_id' => $user->id], $payload);

            $user->update([
                'offers_service' => $request->offers_service,
                'offers_product' => $request->offers_product,
                'has_store' => true,
            ]);

            $store->fill([
                ...$payload,
                'order_number' => $store->order_number ?? Str::uuid()->toString()
            ])->save(['force' => true]);

            $store->categories()->sync($validated['categories']);
            DB::commit();

            $store->refresh();

            return [
                'store' => $store->load('categories'),
                'payment' => $step == '3' && $store->payment_status == GeneralEnum::UNPAID->value ? $this->createPayment($store, $validated, $gateway) : null
            ];
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Creates a payment order link for a given advert listing and promotion plan.
     *
     */
    private function createPayment(Store $store, $payload, $gateway)
    {
        $paymentData = [
            'currency_code' => $store->currency,
            'total_amount' => $gateway == PaymentGatewayEnum::STRIPE->value ? 5 : 5000,
            'order_number' => $store->order_number,
            'type' => PaymentType::VENDOR->value,
            'return_url' => $payload['return_url'],
            'cancel_url' => $payload['cancel_url'],
        ];

        return $this->paymentService->gateway($gateway)->initialize($paymentData);
    }
}
