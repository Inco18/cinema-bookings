<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hall>
 */
class HallFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            "number" => fake()->numberBetween(1, 9),
            "type" => fake()->randomElement(['normal', '3D', 'IMAX', 'VIP'])
        ];
    }
}
