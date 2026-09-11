<?php

namespace App\Notifications\Listing;

use App\Models\AdvertListingPromotePlan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Ads24hrsExpiredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected AdvertListingPromotePlan $plan)
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
        $advertTitle = $this->plan->advertListing->title ?? 'your ad';
        $expiryDate = now()->parse($this->plan->expires_at)->format('F j, Y, g:i A');

        return (new MailMessage)
            ->priority(1)
            ->subject('Oops! Your Ad is Expiring in 24 hours - Renew to Reach More Customers!!')
            ->greeting("Dear {$notifiable->first_name},")
            ->line("We wanted to let you know that your ad promotion on AfricanDiasporaMart for '{$advertTitle}'  will expire on {$expiryDate}. We hope it brought great visibility to your offerings!")
            ->line('You can renew this promo or create a new one to continue attracting more customers.')
            ->line('Simply log into your account, navigate to **Your Ads** in the profile section, and renew with just a few clicks to keep your ad live and impactful!')
            ->line('If you have any questions, feel free to contact us. We are here to support you.');
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
