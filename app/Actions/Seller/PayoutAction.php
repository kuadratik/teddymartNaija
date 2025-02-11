<?php

namespace App\Actions\Seller;

use Illuminate\Support\Facades\Http;

class PayoutAction
{
    /**
     * Create a new class instance.
     */
    public function handle()
    {
        //
    }

    /**
     * Try creating a transfer recipient
     */
    public function recipient(object $resolve, $bank)
    {
        return Http::paystack()->post('transferrecipient', [
            'type' => 'nuban',
            'name' => $resolve->account_name,
            'account_number' => $resolve->account_number,
            'bank_code' => $bank,
            'currency' => 'NGN',
        ])->object();
    }
}
