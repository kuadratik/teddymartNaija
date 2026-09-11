<?php

namespace App\Notifications\Listing;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected $order)
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
        return (new MailMessage)
            ->priority(1)
            ->subject('Oh no! Payment unsuccessful for myEKI Order #' . $this->order->order_number)
            ->greeting('Dear ' . $notifiable->first_name . ',')
            ->line('We are sorry to inform you that we were unable to process the payment for your recent order on myEKI.')
            ->line('To ensure that your order is processed, we recommend that you check your payment method to make sure it is valid and up-to-date. Once you have done so, you can try placing your order again.')
            ->line('If you continue to have issues with your payment, please contact your bank or payment provider to determine the cause of the decline. Alternatively, you can contact our customer support team for assistance with placing your order.')
            ->line('Thank you for choosing myEKI. We apologize for any inconvenience this may have caused.');
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
