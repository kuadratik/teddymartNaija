<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class OrderShippedConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Order $order) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $order = $this->order;
        $currency = $order->currency ?? 'USD';
        $order->increment('delivered_notification_count');
        $shippingCost = $order->shipping_cost;


        $productRows = '';
        foreach ($order->orderDetails as $item) {
            $productName = e($item->listing_name);
            $quantity = e($item->quantity);
            $price = e(number_format($item->listing_price * $item->quantity, 2));

            $productRows .= "
            <tr>
                <td>{$productName}</td>
                <td>{$quantity}</td>
                <td>{$price} {$currency}</td>
            </tr>";
        }

        $productTable = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; margin: auto; margin-top: 20px;">
            <thead>
                <tr>
                    <th style="background-color: #f2f2f2; text-align: left;">Product Name</th>
                    <th style="background-color: #f2f2f2; text-align: left;">Quantity</th>
                    <th style="background-color: #f2f2f2; text-align: left;">Price</th>
                </tr>
            </thead>
            <tbody>' . $productRows . '</tbody>
        </table>';

        return (new MailMessage)
            ->subject('Order Shipped - Confirmation of Delivery Needed')
            ->greeting("Dear {$notifiable->first_name},")
            ->line("We hope you're enjoying your recent purchase from myEKI! To ensure a smooth shopping experience, please take a moment to confirm that you've received your order by clicking the \"Received\" button in the myEKI profile section.")
            ->line(new HtmlString($productTable))
            ->line("**Shipping Fee:** {$shippingCost} {$currency}")
            ->line("Confirming your order helps us improve our service and ensures any necessary support if needed.")
            ->line("If you have any issues with your order, feel free to contact our support team.")
            ->line("Thank you for choosing myEKI!");
    }
}
