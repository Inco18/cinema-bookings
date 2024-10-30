<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Movie>
 */
class MovieFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        $faker = fake();
        $faker->addProvider(new \Xylis\FakerCinema\Provider\Movie($faker));
        $faker->addProvider(new \Xylis\FakerCinema\Provider\Person($faker));
        $durationArr = explode(':', $faker->runtime);
        return [
            'title' => $faker->movie,
            'director' => $faker->director,
            'duration_seconds' => $durationArr[0] * 3600 + $durationArr[1] * 60 + $durationArr[2],
            'description' => $faker->overview,
            'poster_image' => '',
            'release_date' => $faker->date(),
            'age_rating' => $faker->numberBetween(3, 18),
            'genre' => $faker->movieGenre
        ];
    }
}
