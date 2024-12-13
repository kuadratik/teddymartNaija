<?php

namespace App\Notifications\Listing;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Promotion24hrsExpiredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $plan;

    /**
     * Create a new notification instance.
     *
     * @param $plan
     */
    public function __construct($plan)
    {
        $this->plan = $plan;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->priority(1)
            ->subject('Oh no! Your Store Promotion Expires in 24 hours - Time to Renew!')
            ->greeting("Dear {$notifiable->first_name},")
            ->line('We wanted to let you know that your store promotion on myEKI will expire in 24 hours. We hope it helped drive great traffic and visibility to your business!')
            ->line('You can renew this promo or create a new one to continue attracting more customers.')
            ->line('Simply log into your account, go to My Promotions in the profile section, and renew with a few quick steps to keep your store shining!')
            ->line('If you have any questions or need assistance, don’t hesitate to reach out. We’re here to support your success!')
            ->line('Thank you for choosing myEKI!')
            ->salutation('Best regards, The myEKI Team')
            ->replyTo('vendorsupport@myEKI.market', 'myEKI Support');
    }
}
