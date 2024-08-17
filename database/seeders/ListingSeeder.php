<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'teddyedward@teddyed.com')->select('id')->first();

        $store = Store::where('name', 'Amala Sky')->select('id')->first();

        $listings = collect([
            [
                "name" => "House Party Cooking",
                "type" => "service",
                "price" => "10000",
                "description" => "dnndvs",
                "additional_information" => "fdsgrrwg",
                "images" => [
                    "image1", "image2"
                ],
                "category_id" => "14",
                "user_id" => $user->id,
                "store_id" => $store->id
            ],
            [
                "name" => "Pounded yam",
                "type" => "product",
                "price" => "1000",
                "description" => "dnndvs",
                "additional_information" => "fdsgrrwg",
                "images" => [
                    "image1", "image2"
                ],
                "category_id" => "11",
                "user_id" => $user->id,
                "store_id" => $store->id
            ]
        ]);

        $listings->each(function ($listing) {
          Listing::create($listing);
        });
        
    }
}
