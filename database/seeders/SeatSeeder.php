<?php

namespace Database\Seeders;

use App\Models\Seat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeatSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
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
    }
}
