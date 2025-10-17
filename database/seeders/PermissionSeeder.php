<?php

namespace Database\Seeders;

use App\Enums\PermissionType;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => PermissionType::USER_ACCESS->value]);
        Permission::create(['name' => PermissionType::USER_MANAGE->value]);

        Permission::create(['name' => PermissionType::GENRE_ACCESS->value]);
        Permission::create(['name' => PermissionType::GENRE_MANAGE->value]);

        Permission::create(['name' => PermissionType::MOVIE_ACCESS->value]);
        Permission::create(['name' => PermissionType::MOVIE_MANAGE->value]);

        Permission::create(['name' => PermissionType::HALL_ACCESS->value]);
        Permission::create(['name' => PermissionType::HALL_MANAGE->value]);

        Permission::create(['name' => PermissionType::SEAT_ACCESS->value]);
        Permission::create(['name' => PermissionType::SEAT_MANAGE->value]);

        Permission::create(['name' => PermissionType::SHOWING_ACCESS->value]);
        Permission::create(['name' => PermissionType::SHOWING_MANAGE->value]);

        Permission::create(['name' => PermissionType::BOOKING_ACCESS->value]);
        Permission::create(['name' => PermissionType::BOOKING_MANAGE->value]);

        Permission::create(['name' => PermissionType::REWARD_ACCESS->value]);
        Permission::create(['name' => PermissionType::REWARD_MANAGE->value]);

        Permission::create(['name' => PermissionType::USER_REWARD_ACCESS->value]);
        Permission::create(['name' => PermissionType::USER_REWARD_MANAGE->value]);

        Permission::create(['name' => PermissionType::POINTS_HISTORY_ACCESS->value]);
        Permission::create(['name' => PermissionType::POINTS_HISTORY_MANAGE->value]);
    }
}
