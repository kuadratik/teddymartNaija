<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class VendorOrderUpdateReminder extends Notification implements ShouldQueue
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
        $shippingDate = now()->parse($this->order->shipped_at)->format('Y-m-d');
        $shippingFee = $order->shipping_cost;
        $orderDetailsTable = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; margin: auto; margin-top: 20px;">
            <thead>
                <tr>
                    <th style="background-color: #f2f2f2; text-align: left;">Product Name</th>
                    <th style="background-color: #f2f2f2; text-align: left;">Quantity</th>
                    <th style="background-color: #f2f2f2; text-align: left;">Price</th>
                </tr>
            </thead>
            <tbody>';

        foreach ($order->orderDetails as $detail) {
            $price = number_format($detail->listing_price * $detail->quantity, 2);

            $orderDetailsTable .= "
            <tr>
                <td>{$detail->listing_name}</td>
                <td>{$detail->quantity}</td>
                <td>{$price} {$currency}</td>
            </tr>";
        }

        $orderDetailsTable .= '</tbody>
        </table>';
        return (new MailMessage)
            ->subject("Reminder: Please Update the Status of Order {$this->order->order_number}")
            ->greeting("Dear {$notifiable->first_name},")
            ->line("We hope this email finds you well. We're following up regarding Order {$this->order->order_number}. As per our records, the order was shipped on {$shippingDate}, but we noticed that the status has not yet been updated in our system.")
            ->line("To ensure our records are up to date and to provide the customer with accurate information, we kindly ask that you update the delivery status of this order as soon as possible.")
            ->line("Order Details:")
            ->line("**Order ID:** {$this->order->order_number}")
            ->line('')
            ->line(new HtmlString($orderDetailsTable))
            ->line('')
            ->line("**Shipping Fee:** {$shippingFee} {$currency}")
            ->line("**Shipping Date:** {$shippingDate}")
            ->line("If the order has already been delivered, please update the status to \"Delivered\" in the AfricanDiasporaMart vendor portal. If you require any assistance or have further questions, please don't hesitate to contact us.")
            ->line("Thank you for your prompt attention to this matter, and your continued partnership.");
    }
}
