<?php

namespace App\Notifications\Order;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class OrderDeliveredNotification extends Notification implements ShouldQueue
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
            ->subject("Yayy!! 📦Your Order #{$orderNumber} Has Been Delivered!")
            ->greeting("Dear {$customerName},")
            ->line("Great news! Your myEKI order has been successfully delivered to:")
            ->line("Shipping Address: {$shippingAddress}")
            ->line(new HtmlString($productTable))
            ->line("We hope everything arrived in perfect condition and met your expectations. To help us serve you better, please take a moment to rate your order by clicking on the Rate Product button in the myEKI profile section.")
            ->line("By rating the product, you assist other customers in making informed decisions. If there's anything you'd like to share about your experience—or if you need help with your order—don't hesitate to reach out to us.")
            ->line("")
            ->line("Thank you for shopping on myEKI. We look forward to seeing you again soon!");
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
