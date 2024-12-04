<?php

namespace Database\Seeders;

use App\Models\Showing;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShowingSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        Showing::factory(100)->create();
    }
}
