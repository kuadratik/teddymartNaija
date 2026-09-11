<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorOrderUpdateNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Order $order) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Status Update Now Available')
            ->greeting("Dear {$this->order->store->user->first_name},")
            ->line("We hope this email finds you well.")
            ->line("We wanted to notify you that the customer associated with Order #{$this->order->order_number} has not updated their order status within the expected timeframe. You may now proceed with updating the order status as needed.")
            ->line("Please log in to your myEKI vendor portal to update the status of the order to \"Delivered\". If you encounter any issues or require assistance, feel free to reach out to us.")
            ->line("Thank you for your prompt attention to this matter.");
    }
}
