<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cart;
use App\Notifications\AbandonedCartNotification;
use Carbon\Carbon;

class SendAbandonedCartEmails extends Command
{
    protected $signature = 'cart:send-abandoned-emails';
    protected $description = 'Send emails to customers who abandoned their carts 2 days ago';

    public function handle()
    {
        $abandonedCarts = Cart::whereNotNull('user_id')
            ->where('updated_at', '<', now()->subDays(2))
            ->whereHas('products')
            ->get();

        foreach ($abandonedCarts as $cart) {
            $cart->user->notify(new AbandonedCartNotification($cart));
        }

        $this->info('Abandoned cart emails sent successfully.');
    }
}
