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
        $this->call(GenreSeeder::class);
        Movie::factory(10)->create();
        $this->call(HallSeeder::class);
        $this->call(SeatSeeder::class);
        Showing::factory(100)->create();
        Booking::factory(10)->create();
    }
}
