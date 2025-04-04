<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PayoutCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $vendorName;
    protected $paymentAmount;
    protected $paymentDate;

    public function __construct($vendorName, $paymentAmount, $paymentDate)
    {
        $this->vendorName = $vendorName;
        $this->paymentAmount = $paymentAmount;
        $this->paymentDate = $paymentDate;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('💸 Payment Made: Your Payout Request Completed!')
            ->greeting("Dear {$this->vendorName},")
            ->line('Great news! The payment for your recent payout request has been successfully processed. Here are the details:')
            ->line("**Payment Amount:** {$this->paymentAmount}")
            ->line("**Date Paid:** {$this->paymentDate}")
            ->line('The funds should now be reflected in your bank account. Please allow up to 7 -14 business days, depending on your bank.')
            ->line('If you have any questions about this payment or need assistance, our vendor support team is here to help.')
            ->line('Thank you for being an essential part of the myEKI family. We are excited to support your continued success!');
    }
}
