<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            [
                'name' => 'Agriculture and Farming',
                'slug' => Str::slug('Agriculture and Farming'),
                'description' => null,
            ],
            [
                'name' => 'Automotive and Transportation',
                'slug' => Str::slug('Automotive and Transportation'),
                'description' => null,
            ],
            [
                'name' => 'Banking and Finance',
                'slug' => Str::slug('Banking and Finance'),
                'description' => null,
            ],
            [
                'name' => 'Construction and Real Estate',
                'slug' => Str::slug('Construction and Real Estate'),
                'description' => null,
            ],
            [
                'name' => 'Consumer Goods and Retail',
                'slug' => Str::slug('Consumer Goods and Retail'),
                'description' => null,
            ],
            [
                'name' => 'Education and Training',
                'slug' => Str::slug('Education and Training'),
                'description' => null,
            ],
            [
                'name' => 'Energy and Utilities (Oil, Gas, Renewable Energy)',
                'slug' => Str::slug('Energy and Utilities (Oil, Gas, Renewable Energy)'),
                'description' => null,
            ],
            [
                'name' => 'Entertainment and Media',
                'slug' => Str::slug('Entertainment and Media'),
                'description' => null,
            ],
            [
                'name' => 'Fashion and Apparel',
                'slug' => Str::slug('Fashion and Apparel'),
                'description' => null,
            ],
            [
                'name' => 'Food and Beverage (Hospitality, Restaurants)',
                'slug' => Str::slug('Food and Beverage (Hospitality, Restaurants)'),
                'description' => null,
            ],
            [
                'name' => 'Healthcare and Pharmaceuticals',
                'slug' => Str::slug('Healthcare and Pharmaceuticals'),
                'description' => null,
            ],
            [
                'name' => 'Information Technology (IT), Software, and Artificial Intelligence (AI)',
                'slug' => Str::slug('Information Technology (IT), Software, and Artificial Intelligence (AI)'),
                'description' => null,
            ],
            [
                'name' => 'Insurance',
                'slug' => Str::slug('Insurance'),
                'description' => null,
            ],
            [
                'name' => 'Manufacturing',
                'slug' => Str::slug('Manufacturing'),
                'description' => null,
            ],
            [
                'name' => 'Mining and Natural Resources',
                'slug' => Str::slug('Mining and Natural Resources'),
                'description' => null,
            ],
            [
                'name' => 'Nonprofit and Social Services',
                'slug' => Str::slug('Nonprofit and Social Services'),
                'description' => null,
            ],
            [
                'name' => 'Professional Services (Consulting, Legal, Accounting)',
                'slug' => Str::slug('Professional Services (Consulting, Legal, Accounting)'),
                'description' => null,
            ],
            [
                'name' => 'Public Sector and Government',
                'slug' => Str::slug('Public Sector and Government'),
                'description' => null,
            ],
            [
                'name' => 'Telecommunications',
                'slug' => Str::slug('Telecommunications'),
                'description' => null,
            ],
            [
                'name' => 'Tourism and Travel',
                'slug' => Str::slug('Tourism and Travel'),
                'description' => null,
            ],
            [
                'name' => 'Transportation and Logistics',
                'slug' => Str::slug('Transportation and Logistics'),
                'description' => null,
            ],
            [
                'name' => 'Utilities (Water, Electricity, Waste Management)',
                'slug' => Str::slug('Utilities (Water, Electricity, Waste Management)'),
                'description' => null,
            ],
        ];

        Industry::query()->truncate();

        collect($industries)->each(function ($industry) {
            Industry::create($industry);
        });
    }
}
