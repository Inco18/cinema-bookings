<?php

namespace Database\Seeders;

use App\Enums\PermissionType;
use App\Enums\RoleType;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::create(['name' => RoleType::ADMIN]);
        Role::create(['name' => RoleType::WORKER]);
        Role::create(['name' => RoleType::CLIENT]);

        // ADMIN
        $userRole = Role::findByName(RoleType::ADMIN->value);
        $userRole->givePermissionTo(PermissionType::USER_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::USER_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::GENRE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::GENRE_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::MOVIE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::MOVIE_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::HALL_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::HALL_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::SEAT_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SEAT_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::SHOWING_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SHOWING_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::BOOKING_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::BOOKING_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::REWARD_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::REWARD_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::USER_REWARD_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::USER_REWARD_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::POINTS_HISTORY_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::POINTS_HISTORY_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::PRICE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::PRICE_MANAGE->value);

        // WORKER
        $userRole = Role::findByName(RoleType::WORKER->value);
        $userRole->givePermissionTo(PermissionType::GENRE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::MOVIE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::HALL_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SEAT_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SHOWING_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SHOWING_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::BOOKING_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::BOOKING_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::REWARD_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::USER_REWARD_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::USER_REWARD_MANAGE->value);

        // CLIENT
        $userRole = Role::findByName(RoleType::CLIENT->value);
        $userRole->givePermissionTo(PermissionType::GENRE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::MOVIE_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::HALL_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SEAT_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::SHOWING_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::BOOKING_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::BOOKING_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::REWARD_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::USER_REWARD_ACCESS->value);
        $userRole->givePermissionTo(PermissionType::USER_REWARD_MANAGE->value);
        $userRole->givePermissionTo(PermissionType::POINTS_HISTORY_ACCESS->value);
    }
}
