<?php

namespace App\Notifications\Listing;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class ListingInquiryNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private array $respondent, private Listing $listing)
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
        $respondentName = $this->respondent['first_name'];

        $line = <<<EOT
        Product/Service Details:
        <ul>
            <li><strong>Ad title</strong>: {$this->listing->title}</li>
            <li><strong>Category</strong>: {$this->listing?->category?->name}</li>
        </ul>
        EOT;

        return (new MailMessage)
            ->subject('Customer Inquiry: New Message About Your Product/Service on myEKI.')
            ->greeting("Dear {$respondentName},")
            ->line('We’re pleased to inform you that a customer has sent you a message regarding one of your')
            ->line('products or services on myEKI.')
            ->line(new HtmlString($line))
            ->line('Engaging with customers quickly can enhance their experience and increase your chances of')
            ->line('making a sale. To view and respond to this message:')
            ->action('Check your Inbox', url('/'))
            ->line('For any questions or assistance, please reach out. We are here to help!')
            ->line('')
            ->line('Thank you for your dedication to providing quality service on myEKI. We look forward to your continued success')
            ->line('')
            ->line('Best regards')
            ->line('The myEKI Team')
            ->line('vendorsupport@myEKI.market');

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
