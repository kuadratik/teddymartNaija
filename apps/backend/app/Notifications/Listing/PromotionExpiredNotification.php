<?php

namespace App\Notifications\Listing;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class PromotionExpiredNotification extends Notification implements ShouldQueue
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
        Just log into your account, go to My Promotions in the profile section, and renew your payment with a few quick steps to keep your store shining!
        EOT;

        return (new MailMessage)
            ->priority(1)
            ->subject('Oh no! Your Store Promotion has Expired - Time to Renew!')
            ->greeting("Dear {$notifiable->first_name},")
            ->line('We wanted to let you know that your store promotion on AfricanDiasporaMart has now expired. We hope it helped drive great traffic and visibility to your business! Your listing will now appear without the promotional boost, but you can easily renew it to continue attracting more customers.')
            ->line(new HtmlString($line1))
            ->line('If you have any questions or need assistance, do not hesitate to reach out. We are here to support your success!')
            ->line('Thank you for choosing AfricanDiasporaMart!');
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
