<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

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
        return (new MailMessage)
            ->subject('Order Shipped - Confirmation of Delivery Needed')
            ->greeting("Dear {$this->order->customer->first_name},")
            ->line("We hope you're enjoying your recent purchase from myEKI! To ensure a smooth shopping experience, please take a moment to confirm that you've received your order by clicking the \"Received\" button in the myEKI profile section.")
            ->line("Confirming your order helps us improve our service and ensures any necessary support if needed.")
            ->line("If you have any issues with your order, feel free to contact our support team.")
            ->line("Thank you for choosing myEKI!");
    }
}
