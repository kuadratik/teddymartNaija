<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'manage navigation bar',
                'key' => 'manage-navigation-bar',
            ],
            [
                'name' => 'manage brands',
                'key' => 'manage-brands',
            ],
            [
                'name' => 'Manage users',
                'key' => 'manage-users'
            ],
        ];

        Permission::truncate();

        collect($permissions)->each(function ($permission) {
            Permission::create($permission);
        });
    }
}
