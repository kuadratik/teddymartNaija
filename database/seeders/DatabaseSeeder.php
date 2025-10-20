<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->environment('local')) {
            $this->call([
                UserSeeder::class,
                StoreSeeder::class,
                CategorySeeder::class,
                IndustrySeeder::class,
                ListingSeeder::class,
                CountriesTableSeeder::class,
                StatesTableSeeder::class,
                AdvertPromotePlansSeeder::class,
                StorePromotePlanSeeder::class,
                BrandCategorySeeder::class,
            ]);
        }

        if (app()->environment(['live', 'production'])) {
            $this->call([
                CategorySeeder::class,
                IndustrySeeder::class,
                CountriesTableSeeder::class,
                StatesTableSeeder::class,
                AdvertPromotePlansSeeder::class,
                StorePromotePlanSeeder::class,
                BrandCategorySeeder::class,
            ]);
        }
    }
}
