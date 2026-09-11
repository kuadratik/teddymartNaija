<?php

namespace App\Notifications\Listing;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class AdsExpiredNotification extends Notification implements ShouldQueue
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
        $line1 = <<<EOT
        Simply log into your account, navigate to Your Ads in the profile section, and renew your payment with just a few clicks to keep your ad live and impactful!
        EOT;

        return (new MailMessage)
            ->priority(1)
            ->subject('Oops! Your Ad Has Expired – Renew to Reach More Customers!!')
            ->greeting("Dear {$notifiable->first_name}")
            ->line('We wanted to let you know that your ad on AfricanDiasporaMart has now expired. We hope it brought great visibility to your offerings! Your ad will now be listed as a free ad, but you can easily renew it as a paid ad to continue reaching even more customers.')
            ->line(new HtmlString($line1))
            ->line('If you have any questions, feel free to contact us. We are here to support.');
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
