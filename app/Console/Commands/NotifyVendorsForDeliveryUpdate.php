<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Notifications\VendorOrderUpdateNotification;
use Illuminate\Console\Command;

class NotifyVendorsForDeliveryUpdate extends Command
{
    protected $signature = 'orders:notify-vendors-delivery';
    protected $description = 'Notify vendors about orders that can be marked as delivered';

    public function handle()
    {
        Order::with(['store', 'store.user', 'shippingMethod'])
            ->where('status', OrderStatusEnum::SHIPPED)
            ->whereNull('vendor_notified_at')
            ->whereNotNull('shipped_at')
            ->each(function ($order) {
                if ($order->isShippingDurationElapsed()) {
                    $hoursAfterElapsed = now()->diffInHours(
                        $order->shipped_at->addHours(
                            $order->calculateHours(
                                $order->shippingMethod->duration_number,
                                $order->shippingMethod->duration_type
                            )
                        )
                    );

                    if ($hoursAfterElapsed >= 48) {
                    $order->store->user->notify(new VendorOrderUpdateNotification($order));
                    $order->update(['vendor_notified_at' => now()]);
                    }
                }
            });
    }
}
