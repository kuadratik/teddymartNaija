<?php

namespace App\Notifications\Listing;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderSuccessfulNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected $order)
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
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->priority(1)
            ->subject("🎉 Hooray! Your Order #{$this->order->order_number} is Successful!")
            ->greeting("Dear {$notifiable->first_name},")
            ->line("Thank you for shopping with us on myEKI! We're thrilled to let you know that your order has been successfully placed and payment has been processed.")
            ->line("**Order Summary:**")
            ->line("**Order Number:** {$this->order->order_number}")
            ->line("**Order Date:** {$this->order->created_at->format('d M Y')}")
            ->line("**Order Shipping Fee:** {$this->order->shipping_cost}")
            ->line("**Order Sub Total:** {$this->order->subtotal}")
            ->line("**Order Total:** {$this->order->total_amount} {$this->order->currency}")
            ->line("**Shipping Address:**")
            ->line($this->order->shippingAddress->address . ', ' . $this->order->shippingAddress->city . ', ' . $this->order->shippingAddress->state . ', ' . $this->order->shippingAddress->country )
            ->line("Your order is now being prepared. In the meantime, feel free to log into your myEKI account, navigate to the profile section, and check your order status anytime.")
            ->line("If you have any questions or concerns, our support team is always here to help.")
            ->line("Thank you for choosing myEKI!");
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'total' => $this->order->total,
        ];
    }
}
