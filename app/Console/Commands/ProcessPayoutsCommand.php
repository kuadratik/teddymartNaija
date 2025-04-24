<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Models\StorePayoutDetail;
use App\Services\PaymentGateways\PaystackPaymentService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ProcessPayoutsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:process_payouts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process payouts for orders with payout_status set to PROCESSING';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $paystackService = app(PaystackPaymentService::class);

        $supportedCurrencies = ['NGN'];

        $orders = Order::where('payout_status', OrderStatusEnum::PROCESSING->value)
            ->with('store')
            ->get();

        if ($orders->isEmpty()) {
            $this->info('No orders found with payout_status PROCESSING.');
            return;
        }

        foreach ($orders as $order) {
            if (!in_array($order->currency, $supportedCurrencies)) {
                Log::warning('Currency not supported by Paystack', [
                    'order_id' => $order->id,
                    'currency' => $order->currency,
                ]);
                continue;
            }

            $store = $order->store;
            $payoutDetail = StorePayoutDetail::where('store_id', $store->id)
                ->where('is_default', true)
                ->first();

            if (!$payoutDetail) {
                Log::error('No default payout details found for store', ['store_id' => $store->id]);
                continue;
            }

            try {
                $response = $paystackService->processPaystackPayout($order, $payoutDetail);

                if ($response['status'] === 'success') {
                    $order->update(['payout_status' => OrderStatusEnum::PAID->value]);
                    $this->info("Payout processed successfully for order {$order->order_number}");
                } else {
                    Log::error('Payout failed', [
                        'order_id' => $order->id,
                        'response' => $response,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Error processing payout', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Process payout via Paystack.
     */
    private function processPaystackPayout(Order $order, StorePayoutDetail $payoutDetail): array
    {
        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post(config('services.paystack.payment_url') . '/transfer', [
                'source' => 'balance',
                'amount' => intval(round($order->total_amount * 100)),
                'currency' => $order->currency,
                'recipient' => [
                    'type' => 'nuban',
                    'name' => $payoutDetail->account_name,
                    'account_number' => $payoutDetail->account_number,
                    'bank_code' => $payoutDetail->bank_code,
                ],
                'reason' => "Payout for order {$order->order_number}",
            ]);

        return $response->json();
    }
}
