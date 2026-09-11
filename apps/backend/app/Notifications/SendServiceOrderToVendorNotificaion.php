<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class SendServiceOrderToVendorNotificaion extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected Order $order) {}

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
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Customer Interest in Your Service')
            ->greeting("Hello {$this->order->store->user->getFullNameAttribute()},")
            ->line('We are excited to inform you that a customer has shown interest in your services.')
            ->line('Here are the details of the customer’s request:')
            ->line("**Name:** {$this->order->getCustomerNameAttribute()}")
            ->line("**Email:** {$this->order->customer->email}")
            ->line("**Service Requested:** {$this->order->orderDetails()->first()->listing_name}")
            ->action('View Service', env('FRONT_URL') . '/' .  'store/details/'. $this->order->store->slug . '?slug=' . $this->order->orderDetails()->first()->listing->slug)
            ->line('Please reach out to the customer within 24-48 hours to confirm availability and discuss the next steps.')
            ->line('Thank you for using TeddyMart!')
            ->salutation(new HtmlString('Best Regards,<br>The myEKI Team'));
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
