<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Enums\CurrencyType;

class StorePromotePlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [

            'Basic' => [
                'price' => [
                    'AUD' => 1.50,
                    'CAD' => 1.50,
                    'USD' => 1.50,
                    'GBP' => 1.00,
                    'EUR' => 1.50,
                    'NGN' => 700,
                ],
                'duration_days' => 7,
                'description' => 'Basic promotion plan for a short period',
            ],
            'Standard' => [
                'price' => [
                    'AUD' => 2.00,
                    'CAD' => 2.00,
                    'USD' => 2.00,
                    'GBP' => 2.00,
                    'EUR' => 2.00,
                    'NGN' => 1200,
                ],
                'duration_days' => 14,
                'description' => 'Standard promotion plan for medium visibility',
            ],
            'Premium' => [
                'price' => [
                    'AUD' => 3.00,
                    'CAD' => 3.00,
                    'USD' => 3.00,
                    'GBP' => 3.00,
                    'EUR' => 3.00,
                    'NGN' => 2000,
                ],
                'duration_days' => 30,
                'description' => 'Premium promotion plan for maximum visibility',
            ],
        ];

        foreach (CurrencyType::cases() as $currency) {
            foreach ($plans as $name => $plan) {
                DB::table('store_promote_plans')->insert([
                    'name' => $name,
                    'price' => $plan['price'][$currency->value],
                    'description' => $plan['description'],
                    'duration_days' => $plan['duration_days'],
                    'currency' => $currency->value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
