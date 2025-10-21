<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // $this->call(PermissionSeeder::class);
        // $this->call(RoleSeeder::class);
        // $this->call(UserSeeder::class);
        // $this->call(GenreSeeder::class);
        $this->call(MovieSeeder::class);
        // $this->call(HallSeeder::class);
        // $this->call(SeatSeeder::class);
        $this->call(ShowingSeeder::class);
        $this->call(BookingSeeder::class);
        // $this->call(PriceSeeder::class);
        // $this->call(RewardSeeder::class);
    }
}
