<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomerInquiryEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $vendor;

    /**
     * Create a new notification instance.
     *
     * @param mixed $vendor
     */
    public function __construct($vendor)
    {
        $this->vendor = $vendor;
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
        $vendorName = $this->vendor['first_name'] . ' ' . $this->vendor['last_name'];

        return (new MailMessage)
            ->subject('Customer Inquiry: New Message from a Customer on myEKI')
            ->line("Dear {$vendorName},")
            ->line("You’ve received a new message from a customer on myEKI! Engaging with customers quickly can enhance their experience and increase your chances of making a sale.")
            ->line("To view and respond to this message:")
            ->action('Check your Inbox', env('FRONT_URL') . '/' . 'messages')
            ->line("For any questions or assistance, please reach out. We are here to help!")
            ->line("Thank you for choosing myEKI!");
    }
}
