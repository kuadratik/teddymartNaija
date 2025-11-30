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
            [
                'name'=> 'Manage vendors store',
                'key'=> 'manage-vendors-store',
            ]
        ];

        Permission::truncate();

        collect($permissions)->each(function ($permission) {
            Permission::create($permission);
        });
    }
}
