<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use App\Notifications\VendorReminderNotification;

class SendVendorReminderEmails extends Command
{
    protected $signature = 'vendor:send-reminder-emails';
    protected $description = 'Send reminder emails to vendors with at least 1 product listed';

    public function handle()
    {
        $vendors = User::whereHas('store')
            ->whereHas('store.products')
            ->with(['store' => function($query) {
                $query->withCount('products');
            }])
            ->get();

        $emailsSent = 0;

        foreach ($vendors as $vendor) {
            try {
                $vendor->notify(new VendorReminderNotification());
                $emailsSent++;
            } catch (\Exception $e) {
                $this->error("Failed to send email to {$vendor->email}: {$e->getMessage()}");
            }
        }

        $this->info("Sent {$emailsSent} reminder emails to vendors.");
        return Command::SUCCESS;
    }
}
