<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'teddyedward@teddyed.com')->select('id')->first();

        Store::create([
            "name" => "Amala Sky",
            "contact_number" => "1234567898",
            "whatsapp_number" => "1234567890",
            "profile_picture_path" => "1332",
            "banner_path" => "3455",
            "description" => "The best amala in ibadan",
            "address1" => "oluyole ibadan",
            "address2" => "Good arena , eleyele ibadan",
            "state" => "oyo",
            "city" => "ibadan",
            "postal_code" => "100001",
            'user_id'     => $user->id
        ]);

        $user->update([
            'offers_service' => false,
            'offers_product' =>  true,
            'has_store' => true
        ]);
    }
}
