<?php

namespace Database\Seeders;

use App\Enums\RoleType;
use App\Models\Booking;
use App\Models\Genre;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seat;
use App\Models\Showing;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        Genre::factory(10)->create();
        Movie::factory(10)->create();
        Hall::factory(9)->create();
        for ($i = 1; $i < 10; $i++) {
            for ($j = 1; $j < 16; $j++) {
                for ($k = 1; $k < 31; $k++) {
                    Seat::factory()->create([
                        'hall_id' => $i,
                        'row' => $j,
                        'column' => $k,
                        'number' => $k
                    ]);
                }
            }
        }
        Showing::factory(100)->create();
        Booking::factory(10)->create();
    }
}
