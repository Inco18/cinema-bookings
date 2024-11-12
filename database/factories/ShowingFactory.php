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
        $addDays = fake()->numberBetween(0, 8);
        $randomHour = fake()->numberBetween(0, 23);
        $randomMinute = fake()->numberBetween(0, 59);
        $randomMovie = fake()->randomElement($movies);
        return [
            'movie_id' => $randomMovie['id'],
            'hall_id' => fake()->randomElement($halls),
            'start_time' => now()->addDays($addDays)->setHour($randomHour)->setMinute($randomMinute),
            'end_time' => now()->addDays($addDays)->setHour($randomHour)->setMinute($randomMinute)->addSeconds($randomMovie['duration_seconds']),
            'speech_lang' => fake()->randomElement(['PL', 'ENG']),
            'subtitles_lang' => fake()->randomElement(['PL', null]),
            'dubbing_lang' => fake()->randomElement(['PL', null]),
            'type' => fake()->randomElement(ShowingType::toArray())
        ];
    }
}
