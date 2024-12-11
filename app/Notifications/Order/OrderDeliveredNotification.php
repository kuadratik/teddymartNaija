<?php

namespace App\Notifications\Order;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderDeliveredNotification extends Notification
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
        $respondent = $order->customer()->first_name;
        $orderNumber = $order->order_number;

        $line = <<<EOT
        Shopping details:
        <ul>
            <li><strong>Order Number</strong>: {$orderNumber}</li>
            <li><strong>Shipping Date</strong>: {}</li>
        </ul>
        EOT;

        return (new MailMessage)
            ->subject("Reminder: Please Update the Status of Order {$orderNumber}")
            ->greeting("Dear {$respondent},")
            ->line("We hope this email finds you well. We’re following up regarding Order {$orderNumber}. As per")
            ->line("our records, the order was shipped on [Shipping Date], but we noticed that the status has not ")
            ->line('yet been updated in our system.')
            ->line('')
            ->line('To ensure our records are up to date and to provide the customer with accurate information, we')
            ->line('kindly ask that you update the delivery status of this order as soon as possible.')
            ->line($line)
            ->line('If the order has already been delivered, please update the status to “Delivered” in the myEKI')
            ->line("vendor portal. If you require any assistance or have further questions, please don’t hesitate to")
            ->line('contact us.')
            ->line('')
            ->line('Thank you for your prompt attention to this matter, and your continued partnership.')
            ->line("Best regards,")
            ->line('The myEKI Team')
            ->line('vendorsupport@myEKI.market');
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
