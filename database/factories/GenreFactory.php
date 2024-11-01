<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Genre>
 */
class GenreFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        $faker = fake();
        $faker->addProvider(new \Xylis\FakerCinema\Provider\Movie($faker));
        return [
            'name' => $faker->movieGenre
        ];
    }
}
