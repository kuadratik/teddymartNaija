<?php

namespace Database\Seeders;

use App\Enums\ListingType;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cats = collect([
            [
                'name' => 'Electronics',
                'slug' => Str::slug('Electronics'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Fashion',
                'slug' => Str::slug('Fashion'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Home & Kitchen',
                'slug' => Str::slug('Home & Kitchen'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Beauty & Personal Care',
                'slug' => Str::slug('Beauty & Personal Care'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Sports & Outdoors',
                'slug' => Str::slug('Sports & Outdoors'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Books & Media',
                'slug' => Str::slug('Books & Media'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Toys & Games',
                'slug' => Str::slug('Toys & Games'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Automotive',
                'slug' => Str::slug('Automotive'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Health & Wellness',
                'slug' => Str::slug('Health & Wellness'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Groceries',
                'slug' => Str::slug('Groceries'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Food & Dining',
                'slug' => Str::slug('Gourmet Food'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],

            // services
            [
                'name' => 'Home Services',
                'slug' => Str::slug('Home Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Personal Services',
                'slug' => Str::slug('Personal Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Event Services',
                'slug' => Str::slug('Event Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Professional Services',
                'slug' => Str::slug('Professional Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Health & Wellness Services',
                'slug' => Str::slug('Health & Wellness Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Education Services',
                'slug' => Str::slug('Education Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Logistics Services',
                'slug' => Str::slug('Logistics Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Technology Services',
                'slug' => Str::slug('Technology Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Pet Services',
                'slug' => Str::slug('Pet Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],
            [
                'name' => 'Travel Services',
                'slug' => Str::slug('Travel Services'),
                'type' => ListingType::SERVICE,
                'description' => null,
            ],

            // new addition
            [
                'name' => 'Office & Stationery',
                'slug' => Str::slug('Office & Stationery'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Pet Supplies',
                'slug' => Str::slug('Pet Supplies'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Art & Crafts',
                'slug' => Str::slug('Art & Crafts'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Collectibles',
                'slug' => Str::slug('Collectibles'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Travel & Luggage',
                'slug' => Str::slug('Travel & Luggage'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Digital Products',
                'slug' => Str::slug('Digital Products'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Construction',
                'slug' => Str::slug('Construction'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Eco-Friendly',
                'slug' => Str::slug('Eco-Friendly'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],
            [
                'name' => 'Tools & Hardware',
                'slug' => Str::slug('Tools & Hardware'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ]
        ]);

        Category::query()->truncate();

        $cats->each(function ($cat) {
            Category::create($cat);
        });
    }
}