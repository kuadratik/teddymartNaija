<?php

namespace App\Notifications\Listing;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private string $vendorName, private string $productDetails)
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
        return (new MailMessage)
            ->subject('⚠️ Low Stock Alert: Restock Now to Avoid Running Out!')
            ->greeting("Dear {$this->vendorName},")
            ->line('We hope this email finds you well. We wanted to bring to your attention that the inventory level for some of your products on our platform is getting low.')
            ->line('As a result, we would like to notify you to take appropriate actions to restock your inventory and prevent any potential out-of-stock situations.')
            ->line('At myEKI, stock availability is based on the following business rules:')
            ->line('In Stock = Inventory > 5')
            ->line('Low Stock = Inventory < 5')
            ->line('Out of Stock = Inventory < 2')
            ->line('')
            ->line('Here are the details of the products nearing a low stock:')
            ->line(new \Illuminate\Support\HtmlString(nl2br($this->productDetails)))
            ->line('')
            ->line('We recommend that you restock these products as soon as possible to ensure uninterrupted availability for our customers.')
            ->line('You can log in to your vendor account and update the quantity of your products.')
            ->line('')
            ->line('Please note that if the inventory level reaches two, your product may become temporarily unavailable for purchase on our platform. This can impact your sales and may lead to negative customer feedback.')
            ->line('')
            ->line('If you have any questions or need support, our support team is always here to help. Let’s keep your business thriving!')
            ->line('')
            ->line('Thank you for being an essential part of myEKI.')
            ->line('')
            ->line('Best regards,')
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
            'vendorName' => $this->vendorName,
            'productDetails' => $this->productDetails,
        ];
    }
}
