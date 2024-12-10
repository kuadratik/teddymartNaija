<?php

namespace App\Notifications\Listing;

use App\Models\AdvertListing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class AdvertSuccessNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public AdvertListing $advertListing)
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
        $line = <<<EOT
        Here are the details of your ad:
        <ul>
            <li><strong>Ad title</strong>: {$this->advertListing->title}</li>
            <li><strong>Category</strong>: {$this->advertListing?->category?->name}</li>
            <li><strong>Date Posted</strong>: {$this->advertListing?->created_at}</li>
        </ul>
        EOT;

        return (new MailMessage)
            ->priority(1)
            ->subject('Ads success')
            ->greeting('Yay! Your Ad Has Been Successfully Posted on myEKI!')
            ->line("Dear {$notifiable->first_name}")
            ->line('Congratulations! Your Ad has been successfully posted on myEKI.')
            ->line('We’re excited to help you reach a wider audience and showcase your products or services. Your ad is now live, and potential buyers can view and engage with your listing.')
            ->line(new HtmlString($line))
            ->line('If you’ve opted for a free Ad, keep in mind that there are ways to generate more buzz and maximize visibility. To attract even more potential customers, consider upgrading your ad to a paid option. Paid Ads come with enhanced features, such as priority placement and wider audience reach.')
            ->line('You can log in to your account at any time to upgrade your Ad Plan for better exposure.')
            ->line('If you need any assistance or have questions about your ad, please reach out. We’re here to help!')
            ->line('Thank you for choosing myEKI. We wish you great success with your listing!');
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
