<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BrandCategory;

class BrandCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Travel',
            'Home',
            'Fashion',
            'Sports',
            'Health & Beauty',
            'Marketplaces',
            'Luxury',
            'Electronics',
            'Conscious',
        ];

        foreach ($categories as $name) {
            BrandCategory::updateOrCreate(
                ['name' => $name],
                ['is_active' => true]
            );
        }
    }
}
