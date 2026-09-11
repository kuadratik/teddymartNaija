<?php

namespace App\Notifications;

use App\Models\Otp;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class SendEmailVerificationOtp extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected $otp, protected $data) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $this->storeOtp($notifiable);
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {

        return (new MailMessage)
            ->subject('Email Verification OTP')
            ->priority(1)
            ->line('Your OTP for email verification is: ' . $this->otp)
            ->line('This OTP will expire in 5 minutes.')
            ->line('If you did not request this OTP, please ignore this email.')
            ->line('Thank you for using our application!')
            ->salutation(new HtmlString('Best Regards,<br>The AfricanDiasporaMart Team'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'otp' => $this->otp,
        ];
    }

    /**
     * Store the OTP in the database.
     *
     * @param object $notifiable
     */
    protected function storeOtp($notifiable)
    {
        Otp::UpdateOrCreate(
            ['email' => $this->data->email],
            [
                'email' => $this->data->email,
                'otp' => bcrypt($this->otp),
                'expires_at' => now()->addMinutes(5),
                'is_used' => false,
            ]
        );
    }
}
