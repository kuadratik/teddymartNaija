<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'clipper_uid' => Str::uuid()->toString(),
            'first_name' => 'Teddy',
            'last_name' => 'Edward',
            'email' => 'teddyedward@teddyed.com',
            'password' => bcrypt('12345678'),
            'offers_product' => false,
            'offers_service' => false,
            'has_store' => false,
        ]);

        User::create([
            'clipper_uid' => Str::uuid()->toString(),
            'first_name' => 'Richard',
            'last_name' => 'Ejike',
            'email' => 'richardejike0172@gmail.com',
            'password' => bcrypt('12345678'),
            'offers_product' => false,
            'offers_service' => false,
            'has_store' => false,
        ]);
    }
}
