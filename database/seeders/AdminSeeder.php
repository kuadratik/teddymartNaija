<?php

namespace Database\Seeders;

use App\Enums\GeneralEnum;
use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'email' => 'admin@myeki.market',
            'password' => 'password123',
            'role' => GeneralEnum::SUPER_ADMIN,
        ]);
    }
}
