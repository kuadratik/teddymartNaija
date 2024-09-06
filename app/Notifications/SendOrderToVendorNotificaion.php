<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class SendOrderToVendorNotificaion extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected Order $order)
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
        $details =
            "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%; max-width: 600px; margin: auto;'>
                <tbody>
                    <tr>
                        <td style='background-color: #f2f2f2; text-align: left;'>Name:</td>
                        <td>{$this->order->getFullNameAttribute()}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #f2f2f2; text-align: left;'>Phone Number:</td>
                        <td>{$this->order->phone}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #f2f2f2; text-align: left;'>Email:</td>
                        <td>{$this->order->email}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #f2f2f2; text-align: left;'>Total Amount:</td>
                        <td>{$this->order->total_amount}</td>
                    </tr>
                </tbody>
            </table>";


        $orderDetailsTable =
            "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse; width: 100%; max-width: 600px; margin: auto; margin-top: 20px;'>
            <thead>
                <tr>
                    <th style='background-color: #f2f2f2; text-align: left;'>Product Name</th>
                    <th style='background-color: #f2f2f2; text-align: left;'>Price</th>
                </tr>
            </thead>
            <tbody>";

        foreach ($this->order->orderDetails as $detail) {
            $orderDetailsTable .= "
            <tr>
                <td>{$detail->listing_name}</td>
                <td>{$detail->listing_price}</td>
            </tr>";
        }

        $orderDetailsTable .= "
            </tbody>
        </table>";

        return (new MailMessage)
            ->priority(1)
            ->subject('New Order Alert')
            ->greeting("Hello {$notifiable->getFullNameAttribute()},")
            ->line("You have received a new order request from a customer. Below are the details of the order:")
            ->line(new HtmlString($details))
            ->line(new HtmlString($orderDetailsTable))
            ->line('Thank you for your prompt attention to this request!')
            ->salutation('Best Regards,')
            ->salutation('The TeddyMart Team');
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
