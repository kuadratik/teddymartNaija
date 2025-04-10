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
        $customerName = $order->customer->first_name;
        $orderNumber = substr($order->order_number, 0, 8);
        $shippingMethod = $order->shippingMethod->method_type;
        $shippingAddress = $order->shippingAddress->getFormattedAddress();

        $productRows = '';
        foreach ($order->orderDetails as $item) {
            $productRows .= "
            <tr>
                <td>{$item->listing_name}</td>
                <td>{$item->quantity}</td>
                <td>\${$item->listing_price}</td>
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
            ->line("Great news! Your Order {$orderNumber} is now on its way!")
            ->line(new HtmlString("<strong>Shipping Details:</strong>"))
            ->line(new HtmlString("<ul>"))
            ->line(new HtmlString("<li>Shipping Method: {$shippingMethod}</li>"))
            ->line(new HtmlString("<li>Shipping Address: {$shippingAddress}</li>"))
            ->line(new HtmlString("</ul>"))
            ->line(new HtmlString($productTable))
            ->line("")
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
