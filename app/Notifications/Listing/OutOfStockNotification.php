<?php

namespace App\Notifications\Listing;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OutOfStockNotification extends Notification
{
    use Queueable;

    protected $vendorName;
    protected $productDetails;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $vendorName, string $productDetails)
    {
        $this->vendorName = $vendorName;
        $this->productDetails = $productDetails;
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
            ->subject('🚨Urgent: Your Product is Out of Stock!')
            ->greeting("Dear {$this->vendorName},")
            ->line('We are writing to notify you that the inventory level for some of your products on our platform is critically low (< 2).')
            ->line('As a result, we need you to take immediate action to restock your inventory as acting quickly will help you avoid losing sales opportunities and ensure customers can continue purchasing from your store.')
            ->line('At myEKI, stock availability is based on the following business rules:')
            ->line('In Stock = Inventory > 5')
            ->line('Low Stock = Inventory < 5')
            ->line('Out of Stock = Inventory < 2')
            ->line('Here are the details of the products that are out of stock completely:')
            ->line($this->productDetails)
            ->line('We recommend that you restock these products as soon as possible to ensure uninterrupted availability for our customers.')
            ->line('You can log in to your vendor account and update the quantity of your products.')
            ->line('If you have any questions or need assistance, feel free to contact us.')
            ->line('Thank you for your prompt attention, and we appreciate your partnership on myEKI!')
            ->line('Best regards,')
            ->line('The myEKI Team')
            ->line('vendorsupport@myEKI.market');
    }
}
