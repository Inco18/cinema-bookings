<?php

namespace Database\Seeders;

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
        User::factory(35)->create();
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Adminowy',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => '12345678',
        ]);
        Genre::factory(10)->create();
        Movie::factory(105)->create();
        Hall::factory(9)->create();
        for ($i = 1; $i < 3; $i++) {
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
        Showing::factory(10)->create();
        Booking::factory(10)->create();
    }
}
