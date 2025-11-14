<?php

namespace App\Actions;

use App\Enums\CurrencyType;
use App\Enums\GeneralEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentType;
use App\Models\Country;
use App\Models\Store;
use App\Models\StoreFeeHistory;
use App\Models\User;
use App\Services\PaymentGateways\PaymentService;
use App\Support\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CreateStoreAction
{
    private const STRIPE_FEE = 5;
    private const PAYSTACK_FEE = 5000;

    private const STEP_CREATE = '1';
    private const STEP_MEDIA = '2';
    private const STEP_PAYMENT = '3';

    public function __construct(protected PaymentService $paymentService)
    {
        //
    }

    /**
     * Execute store creation flow based on step
     * @return array ['store' => Store, 'payment_info' => array|null]
     */
    public function execute(array $validated, int|string $step, User $user): array
    {
        $this->validateStep($step);

        try {
            DB::beginTransaction();

            $result = match ($step) {
                self::STEP_CREATE => $this->handleStepOne($validated, $user),
                self::STEP_MEDIA => $this->handleStepTwo($validated, $user, $step),
                self::STEP_PAYMENT => $this->handleStepThree($validated, $user, $step),
            };

            DB::commit();

            return $result;
        } catch (\Throwable $th) {
            DB::rollBack();
            logger($th);
            throw $th;
        }
    }

    /**
     * Step 1: Create or update store basic information
     */
    private function handleStepOne(array $validated, $user): array
    {
        $country = Country::findOrFail($validated['country_id']);
        $currency = $country->currency_code ?? CurrencyType::USD;
        $gateway = $this->determinePaymentGateway($currency);
        $feeAmount = $this->getFeeAmount($gateway);

        $storeData = collect($validated)
            ->except(['id', 'categories', 'offers_service', 'offers_product'])
            ->merge([
                'country_id' => $validated['country_id'],
                'currency' => $currency,
                'step' => self::STEP_CREATE,
                'fee_amount' => $feeAmount,
            ])
            ->toArray();

        $store = $this->createOrUpdateStore(
            $validated['id'] ?? null,
            $user->id,
            $storeData
        );

        $store->categories()->sync($validated['categories']);

        $user->update([
            'offers_service' => $validated['offers_service'],
            'offers_product' => $validated['offers_product'],
            'has_store' => true,
        ]);

        return [
            'store' => $store->fresh(['categories']),
            'payment_info' => null,
        ];
    }

    /**
     * Step 2: Update store media (banner and profile picture)
     */
    private function handleStepTwo(array $validated, $user, $step): array
    {
        $store = Store::where('id', $validated['id'])
            ->where('user_id', $user->id)->firstOrFail();

        $this->validateStepHandle($store, $step);

        $updateData = [
            'step' => self::STEP_MEDIA,
            'banner_path' => data_get($validated, 'banner_path') ? Utils::moveToPermanentPath([$validated['banner_path']], 'images')[0] : null,
            'profile_picture_path' => data_get($validated, 'profile_picture_path') ? Utils::moveToPermanentPath([$validated['profile_picture_path']], 'images')[0] : null,
        ];

        $store->update($updateData);

        return [
            'store' => $store->fresh(['categories']),
            'payment_info' => null,
        ];
    }

    /**
     * Step 3: Initialize payment for store fee
     */
    private function handleStepThree(array $validated, $user, $step): array
    {
        $store = Store::where('id', $validated['id'])
            ->where('user_id', $user->id)->firstOrFail();

        if ($store->payment_status == GeneralEnum::SUCCESS->value) {
            return [
                'store' => $store->fresh(['categories']),
                'payment_info' => null,
            ];
        }

        $gateway = $this->determinePaymentGateway($store->currency);
        $feeAmount = $this->getFeeAmount($gateway);
        $paymentInfo = $this->initializePayment($store, $validated, $gateway, $feeAmount);

        if ($paymentInfo) {
            $history = StoreFeeHistory::create([
                'store_id' => $store->id,
                'status' => GeneralEnum::PENDING,
                'gateway' => $gateway,
                'currency' => $store->currency,
                'amount' => $feeAmount,
            ]);

            $store->update([
                'step' => self::STEP_PAYMENT,
                'fee_gateway' => $gateway,
                'store_fee_history_id' => $history->id,
            ]);
        }

        return [
            'store' => $store->fresh(['categories']),
            'payment_info' => $paymentInfo,
        ];
    }

    /**
     * Create or update store record
     */
    private function createOrUpdateStore(?int $storeId, int $userId, array $data): Store
    {
        if ($storeId) {
            $store = Store::where('id', $storeId)
                ->where('user_id', $userId)
                ->firstOrFail();

            $data['order_number'] = $store->order_number ?? Str::uuid()->toString();

            $store->update($data);
        } else {
            $data['user_id'] = $userId;
            $data['order_number'] = Str::uuid()->toString();
            $store = Store::create($data);
        }

        return $store;
    }

    /**
     * Initialize payment with gateway
     */
    private function initializePayment(Store $store, array $validated, string $gateway, int $feeAmount): ?array
    {
        try {
            $paymentData = [
                'currency_code' => $store->currency,
                'total_amount' => $feeAmount,
                'order_number' => $store->order_number,
                'type' => PaymentType::VENDOR->value,
                'return_url' => $validated['return_url'],
                'cancel_url' => $validated['cancel_url'],
            ];

            return $this->paymentService->gateway($gateway)->initialize($paymentData);
        } catch (\Throwable $e) {
            Log::error('Payment initialization failed', [
                'store_id' => $store->id,
                'gateway' => $gateway,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Determine payment gateway based on currency
     */
    private function determinePaymentGateway(string $currency): string
    {
        return in_array($currency, CurrencyType::foreignCurrency())
            ? PaymentGatewayEnum::STRIPE->value
            : PaymentGatewayEnum::PAYSTACK->value;
    }

    /**
     * Get fee amount for gateway
     */
    private function getFeeAmount(string $gateway): int
    {
        return $gateway === PaymentGatewayEnum::STRIPE->value
            ? self::STRIPE_FEE
            : self::PAYSTACK_FEE;
    }

    /**
     * Validate step number
     */
    private function validateStep(int|string $step): void
    {
        if (!in_array($step, [self::STEP_CREATE, self::STEP_MEDIA, self::STEP_PAYMENT])) {
            throw new \InvalidArgumentException("Invalid step: {$step}. Must be 1, 2, or 3");
        }
    }

    /**
     * validate the step handler
     */
    private function validateStepHandle(Store $store, int|string $step)
    {
        abort_if(
            intval($store->step) !== (intval($step) - 1),
            Response::HTTP_BAD_REQUEST,
            'Please complete the previous step before you can continue.'
        );
    }
}