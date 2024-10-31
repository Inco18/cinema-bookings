<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        User::factory(35)->create();
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Adminowy',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => '12345678',
        ]);
        Movie::factory(105)->create();

    }
}
