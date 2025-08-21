<?php

namespace Database\Seeders;

use App\Models\Price;
use Illuminate\Database\Seeder;

class PriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Price::create([
            'ticket_type' => 'normal',
            'base_price' => 31.50,
            'min_price' => 15.00,
            'max_price' => 100.00,
        ]);
        Price::create([
            'ticket_type' => 'reduced',
            'base_price' => 25.00,
            'min_price' => 10.00,
            'max_price' => 80.00,
        ]);
    }
}
