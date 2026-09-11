<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AbandonedCartNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $cart;

    /**
     * Create a new notification instance.
     *
     * @param $cart
     */
    public function __construct($cart)
    {
        $this->cart = $cart;
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
            ->subject('Uh-Oh! Did you forget something in your cart?')
            ->greeting('Dear ' . $notifiable->first_name . ',')
            ->line('We couldn’t help but notice that you left something behind. Your cart is still waiting for you, and the items you love are just a click away from being yours.')
            ->line('If you encounter any issues or have any questions about your order, please don\'t hesitate to contact us. We are always here to help.')
            ->line('Thank you for choosing AfricanDiasporaMart. We’re excited to serve you!');
    }
}
