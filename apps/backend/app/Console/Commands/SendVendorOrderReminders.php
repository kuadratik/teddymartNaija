<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Notifications\VendorOrderUpdateReminder;
use Illuminate\Console\Command;

class SendVendorOrderReminders extends Command
{
    protected $signature = 'orders:send-vendor-reminders';
    protected $description = 'Send reminders to vendors about updating order status to delivered';

    public function handle()
    {
        Order::with(['store', 'store.user', 'shippingMethod'])
            ->where('status', OrderStatusEnum::SHIPPED)
            ->whereNotNull('shipped_at')
            ->each(function ($order) {
                if ($order->isShippingDurationElapsed()) {
                    $order->store->user->notify(new VendorOrderUpdateReminder($order));
                }
            });
    }
}
