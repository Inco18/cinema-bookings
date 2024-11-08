<?php

namespace Database\Seeders;

use App\Enums\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        User::factory(100)->create();

        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Adminowy',
            'email' => 'admin@admin.com',
            'password' => '12345678',
        ])->assignRole(RoleType::ADMIN->value)->assignRole(RoleType::WORKER->value)->removeRole(RoleType::CLIENT->value);

        User::factory()->create([
            'first_name' => 'Pracownik',
            'last_name' => 'Pracowniczy',
            'email' => 'worker@worker.com',
            'password' => '12345678',
        ])->assignRole(RoleType::WORKER->value)->removeRole(RoleType::CLIENT->value);
        ;
    }
}
