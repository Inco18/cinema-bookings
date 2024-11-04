<?php

namespace Database\Factories;

use App\Models\Hall;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Seat>
 */
class SeatFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        $halls = Hall::pluck('id')->toArray();
        return [
            'hall_id' => fake()->randomElement($halls),
            'type' => "normal",
            'row' => fake()->numberBetween(1, 15),
            'column' => fake()->numberBetween(1, 30),
            'number' => fake()->numberBetween(1, 30),
        ];
    }
}
