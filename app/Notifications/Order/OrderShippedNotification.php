<?php

namespace App\Notifications\Order;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class OrderShippedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Order $order)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }



    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->order;
        $currency = $order->currency ?? 'USD';
        $customerName = $order->customer->first_name;
        $orderNumber = $order->order_number;
        $shippingMethod = $order->shippingMethod->method_type;
        $shippingAddress = $order->shippingAddress?->getFormattedAddress();
        $shippingCost =  number_format($order->shipping_cost, 2);


        $productRows = '';
        foreach ($order->orderDetails as $item) {
            $productName = $item->listing_name;
            $quantity = $item->quantity;
            $price = number_format($item->listing_price * $item->quantity, 2);
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
            ->subject("Hooray!! Your Order Has Been Shipped – {$orderNumber}")
            ->greeting("Dear {$customerName},")
            ->line(new HtmlString("Great news! Your order <strong>{$orderNumber}</strong> is now on its way!"))
            ->line(new HtmlString('<strong>Shipping Details:</strong>'))
            ->line(new HtmlString("<ul style='margin: 0; padding-left: 20px;'>"))
            ->line(new HtmlString("<li><strong>Shipping Method:</strong> " . ucwords($shippingMethod) . "</li>"))
            ->line(new HtmlString("<li><strong>Shipping Address:</strong> {$shippingAddress}</li>"))
            ->line(new HtmlString("<li><strong>Shipping Fee:</strong> {$shippingCost}&nbsp;{$currency}</li>"))
            ->line(new HtmlString("</ul>"))
            ->line(new HtmlString($productTable))
            ->line(' ')
            ->line("If you have any questions or concerns about your shipment or tracking information, please don't hesitate to contact our customer support team.");
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
