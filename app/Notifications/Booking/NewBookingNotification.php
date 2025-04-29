<?php

namespace App\Notifications\Booking;

use App\Models\BusinessListing;
use App\Models\UserBookBusinessService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    protected $booking;
    protected $businessListing;

    /**
     * Create a new notification instance.
     */
    public function __construct(UserBookBusinessService $booking, BusinessListing $businessListing)
    {
        $this->booking = $booking;
        $this->businessListing = $businessListing;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Great News! You've Got a New Booking! 🎉")
            ->greeting("Hello {$notifiable->name}")
            ->line("You have a new service booking on myEKI!")
            ->line("Date: {$this->booking->created_at->toDateString()}")
            ->line("Time: {$this->booking->created_at->toTimeString()}")
            ->line("Service Requested: {$this->businessListing->business_name}")
            ->line("Client Name: {$this->booking->cus_fullname}")
            ->line("Client Email: {$this->booking->cus_email}")
            ->line("Client Phone: {$this->booking->cus_phone_number}")
            ->line("Please review the details and any message received in readiness for your appointment.")
            ->line("We anticipate your client will have a great experience!");
    }
}
