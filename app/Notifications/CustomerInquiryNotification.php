<?php

namespace App\Notifications;

use App\Models\AdvertListing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class CustomerInquiryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private array $respondent, private AdvertListing $advertListing)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $respondentName = $this->respondent['first_name'];

        $line = <<<EOT
        Here are the details of your ad:
        <ul>
            <li><strong>Ad title</strong>: {$this->advertListing->title}</li>
            <li><strong>Category</strong>: {$this->advertListing?->category?->name}</li>
        </ul>
        EOT;

        return (new MailMessage)
            ->subject('New Message Alert: Customer Inquiry About Your Ad on myEKI')
            ->greeting("Dear {$respondentName}")
            ->line('You have a new message from a customer regarding one of your Ads on myEKI!')
            ->line(new HtmlString($line))
            ->line('To view and respond to this message, please log in to your myEKI account and navigate to your message.')
            ->line('Timely responses can improve your engagement and lead to successful sales.')
            ->action('Log in to myEKI', env('FRONT_URL') . '/login')
            ->line('Maximize Your Sales Potential: Prompt communication helps build trust with potential buyers. ')
            ->line('Be sure to check your messages regularly and respond to inquiries as soon as possible.')
            ->line("If you have any questions or need support managing your messages. We're always here to assist you!")
            ->line('Thank you for being a valued member of myEKI. We wish you continued success with your business!');
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
