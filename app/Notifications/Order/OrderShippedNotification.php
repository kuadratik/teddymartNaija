<?php

namespace App\Notifications\Order;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderShippedNotification extends Notification
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
            <li><strong>Shopping Method</strong>: {}</li>
            <li><strong>Shopping Address</strong>: {}</li>
        </ul>
        EOT;

        return (new MailMessage)
            ->subject("Hooray!! Your Order Has Been Shipped – {$orderNumber} ")
            ->greeting("Dear {$respondent},")
            ->line("Great news! Your Order {$orderNumber} is now on its way!")
            ->line("If you have any questions or concerns about your shipment or tracking information, please don't")
            ->line('hesitate to contact our customer support team.')
            ->line('')
            ->line('Thank you for choosing myEKI for your online shopping needs.')
            ->line('')
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
