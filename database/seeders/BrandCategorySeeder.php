<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BrandCategory;
use Illuminate\Support\Facades\DB;

class BrandCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Fashion & Apparel',
            'Beauty & Personal Care',
            'Health & Wellness',
            'Food & Grocery',
            'Home & Living',
            'Electronics & Gadgets',
            'Cloud, AI & Technology',
            'Digital Creators & Media',
            'Education & Skill Development',
            'Travel & Experiences',
            'Automotive & Mobility',
            'Luxury & Lifestyle',
            'Eco & Sustainable Living',
            'Finance & Investments',
            'Business & B2B Solutions',
            'Professional Services',
            'Entertainment & Streaming',
            'Gaming & Virtual Worlds',
            'Baby, Kids & Family',
            'Pets & Animals',
            'Science & Innovation',
            'Faith, Culture & Community',
            'Social Impact & Nonprofits',
            'Local & Classifieds',
            'Subscription & Membership Brands',
            'Smart Home & IoT',
            'Metaverse & Web3 Brands',
            'Remote Work & Productivity Tools',
            'AR/VR & Immersive Tech',
            'Digital Identity & Security'
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        BrandCategory::query()->truncate();

        foreach ($categories as $name) {
            BrandCategory::updateOrCreate(
                ['name' => $name],
                ['is_active' => true]
            );
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
