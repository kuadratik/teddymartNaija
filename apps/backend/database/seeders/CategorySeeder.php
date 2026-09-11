<?php

namespace Database\Seeders;

use App\Enums\GeneralEnum;
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
        $categories = collect([
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
            ],
            [
                'name' => 'Babies & Kids',
                'slug' => Str::slug('Babies & Kids'),
                'type' => ListingType::PRODUCT,
                'description' => null,
            ],

            // store categories
            [
                'name' => 'Fashion & Apparel',
                'slug' => Str::slug('Fashion & Apparel stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Beauty & Personal Care',
                'slug' => Str::slug('Beauty & Personal Care stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Health & Wellness',
                'slug' => Str::slug('Health & Wellness stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Home & Living',
                'slug' => Str::slug('Home & Living stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Food & Grocery',
                'slug' => Str::slug('Food & Grocery stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Electronics & Gadgets',
                'slug' => Str::slug('Electronics & Gadgets stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Cloud, AI & Technology',
                'slug' => Str::slug('Cloud, AI & Technology stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Digital Creators & Media',
                'slug' => Str::slug('Digital Creators & Media stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Education & Skill Development',
                'slug' => Str::slug('Education & Skill Development stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Travel & Experiences',
                'slug' => Str::slug('Travel & Experiences stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Automotive & Mobility',
                'slug' => Str::slug('Automotive & Mobility stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Luxury & Lifestyle',
                'slug' => Str::slug('Luxury & Lifestyle stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Eco & Sustainable Living',
                'slug' => Str::slug('Eco & Sustainable Living stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Finance & Investments',
                'slug' => Str::slug('Finance & Investments stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Business & B2B Solutions',
                'slug' => Str::slug('Business & B2B Solutions stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Professional Services',
                'slug' => Str::slug('Professional Services stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Entertainment & Streaming',
                'slug' => Str::slug('Entertainment & Streaming stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Gaming & Virtual Worlds',
                'slug' => Str::slug('Gaming & Virtual Worlds stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Baby, Kids & Family',
                'slug' => Str::slug('Baby, Kids & Family stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Pets & Animals',
                'slug' => Str::slug('Pets & Animals stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Science & Innovation',
                'slug' => Str::slug('Science & Innovation stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Faith, Culture & Community',
                'slug' => Str::slug('Faith, Culture & Community stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Social Impact & Nonprofits',
                'slug' => Str::slug('Social Impact & Nonprofits stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Local & Classifieds',
                'slug' => Str::slug('Local & Classifieds stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Subscription & Membership Brands',
                'slug' => Str::slug('Subscription & Membership Brands stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Smart Home & IoT',
                'slug' => Str::slug('Smart Home & IoT stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Metaverse & Web3 Brands',
                'slug' => Str::slug('Metaverse & Web3 Brands stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Remote Work & Productivity Tools',
                'slug' => Str::slug('Remote Work & Productivity Tools stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'AR/VR & Immersive Tech',
                'slug' => Str::slug('AR/VR & Immersive Tech stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ],
            [
                'name' => 'Digital Identity & Security',
                'slug' => Str::slug('Digital Identity & Security stores'),
                'type' => GeneralEnum::STORE,
                'description' => null,
            ]
        ]);

        Category::query()->truncate();

        $categories->each(function ($category) {
            Category::create($category);
        });
    }
}