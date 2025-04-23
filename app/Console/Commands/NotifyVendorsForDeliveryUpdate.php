<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Notifications\VendorOrderUpdateNotification;
use App\Traits\HandlesDuration;
use Illuminate\Console\Command;
use Carbon\Carbon;

class NotifyVendorsForDeliveryUpdate extends Command
{
    use HandlesDuration;

    protected $signature = 'orders:notify-vendors-delivery';
    protected $description = 'Notify vendors about orders that can be marked as delivered';

    public function handle()
    {
        Order::with(['store', 'store.user', 'shippingMethod'])
            ->where('status', OrderStatusEnum::SHIPPED)
            ->whereNull('vendor_notified_at')
            ->whereNotNull('shipped_at')
            ->each(function (Order $order) {
                if ($order->isShippingDurationElapsed()) {
                    $order->store->user->notify(new VendorOrderUpdateNotification($order));
                    $order->update(['vendor_notified_at' => now()]);
            }
            });
    }
}
