<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorReminderNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
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
            ->subject('Boost Your Store\'s Visibility: Add More Products Today!')
            ->greeting('Dear ' . $notifiable->first_name . ',')
            ->line('Great work on getting started with your myEKI store!')
            ->line('Here\'s a quick tip to help you attract more customers and increase your sales: stores with multiple products tend to perform better. Adding more items not only improves your store\'s visibility on the platform but also gives buyers more options to explore.')
            ->line('To stay ahead:')
            ->line('• Add new and trending products regularly')
            ->line('• Include clear images and detailed descriptions')
            ->line('• Update pricing and availability as needed')
            ->action('Manage Your Store', url(env('FRONTEND_URL', 'https://myeki.market') . '/store/dashboard'))
            ->line('If you have any questions or need support, our team is here to help.')
            ->line('Let\'s grow your store together!');
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
