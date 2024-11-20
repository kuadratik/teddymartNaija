<?php

namespace App\Notifications\Listing;

use App\Models\BusinessListing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class BizListedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public BusinessListing $businessListing)
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
        Congratulations! We’re thrilled to inform you that your business has been successfully listed in the <strong>MEK Directory</strong>. Now, thousands of potential customers can easily discover and connect with your services.
        EOT;

        return (new MailMessage)
            ->subject('Yay!! Welcome to MEK Directory – Your Business is Now Listed!')
            ->greeting("Dear {$notifiable->first_name}")
            ->line(new HtmlString($line1))
            ->line('With your listing now live, your business will benefit from increased visibility and the chance to connect with customers searching for trusted providers just like you.')
            ->line('If you have any questions or need assistance, the support team is here to help.')
            ->line('Thank you for joining MEK Directory! We look forward to supporting your business growth and success.');
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
