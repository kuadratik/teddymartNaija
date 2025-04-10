<?php

namespace App\Notifications\Listing;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class VendorNewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     *
     * @param $order
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param object $notifiable
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $orderDetailsTable = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; margin: auto; margin-top: 20px;">
            <thead>
                <tr>
                    <th style="background-color: #f2f2f2; text-align: left;">Product Name</th>
                    <th style="background-color: #f2f2f2; text-align: left;">Quantity</th>
                    <th style="background-color: #f2f2f2; text-align: left;">Price</th>
                </tr>
            </thead>
            <tbody>';

        foreach ($this->order->orderDetails as $detail) {
            $orderDetailsTable .= "
            <tr>
                <td>{$detail->listing_name}</td>
                <td>{$detail->quantity}</td>
                <td>{$detail->listing_price}</td>
            </tr>";
        }

        $orderDetailsTable .= '</tbody>
        </table>';

        return (new MailMessage)
            ->subject('New Order Placed - [' . $this->order->uid . ']')
            ->greeting('Dear ' . $notifiable->first_name . ',')
            ->line('We are pleased to inform you that a new order has been placed on myEKI. Congratulations on your sale!')
            ->line('Please find the details of the order below:')
            ->line('**Order ID:** ' . $this->order->uid)
            ->line('**Shipping Fee:** ' . $this->order->shipping_cost)
            // ->line('**Sub Total:** ' . $this->order->subtotal)
            ->line('**Total:** ' . $this->order->total_amount)
            ->line('**Shipping Address:** ' . $this->order->shippingAddress->address . ', ' . $this->order->shippingAddress->city . ', ' . $this->order->shippingAddress->state . ', ' . $this->order->shippingAddress->country)

            ->line(new HtmlString($orderDetailsTable))
            ->line('Please process the order and update the status of the order as Shipped in the myEKI list of orders, once it has been dispatched.')
            ->line('Thank you for your prompt attention to this order. We appreciate your continued partnership and look forward to working with you on future orders.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
