<?php

namespace App\Console\Commands;

use App\Enums\OrderStatusEnum;
use App\Models\Order;
use App\Notifications\OrderShippedConfirmation;
use App\Traits\HandlesDuration;
use Illuminate\Console\Command;

class NotifyShippedOrders extends Command
{
    use HandlesDuration;

    protected $signature = 'orders:notify-shipped';
    protected $description = 'Send two notifications at 50% intervals during shipping duration';

    public function handle()
    {
        Order::with('shippingMethod')
            ->where('status', OrderStatusEnum::SHIPPED)
            ->whereNotNull('shipped_at')
            ->where('delivered_notification_count', '<=', 2)
            ->each(function ($order) {
                if (
                    is_null($order->shippingMethod) ||
                    is_null($order->shippingMethod->duration_number) ||
                    is_null($order->shippingMethod->duration_type)
                ) {
                    return;
                }

                $totalHours = $this->calculateHours(
                    $order->shippingMethod->duration_number,
                    $order->shippingMethod->duration_type
                );

            $intervals = [
                1 => $totalHours
                ];

            $shippedAt = \Carbon\Carbon::parse($order->shipped_at);

            $hoursElapsed = $shippedAt->lessThanOrEqualTo(now())
                ? $shippedAt->diffInHours(now())
                : 0;
            $nextNotification = $order->notification_count + 1;
                if (isset($intervals[$nextNotification]) && $hoursElapsed >= $intervals[$nextNotification]) {
                    $order->customer->notify(new OrderShippedConfirmation($order));
                    $order->increment('delivered_notification_count');
                }
            });
    }
}
