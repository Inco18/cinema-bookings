<?php

namespace Database\Factories;

use App\Enums\ShowingType;
use App\Models\Hall;
use App\Models\Movie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Showing>
 */
class ShowingFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        $halls = Hall::pluck('id')->toArray();
        $movies = Movie::all()->toArray();
        $addDays = fake()->numberBetween(10, 30);
        $randomMovie = fake()->randomElement($movies);
        return [
            'movie_id' => $randomMovie['id'],
            'hall_id' => fake()->randomElement($halls),
            'start_time' => now()->addDays($addDays),
            'end_time' => now()->addDays($addDays)->addSeconds($randomMovie['duration_seconds']),
            'speech_lang' => fake()->randomElement(['PL', 'ENG']),
            'subtitles_lang' => fake()->randomElement(['PL', null]),
            'dubbing_lang' => fake()->randomElement(['PL', null]),
            'type' => fake()->randomElement(ShowingType::toArray())
        ];
    }
}
