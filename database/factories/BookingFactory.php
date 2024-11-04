<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Seat;
use App\Models\Showing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory {
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        $showings = Showing::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();
        return [
            'showing_id' => fake()->randomElement($showings),
            'user_id' => fake()->randomElement($users),
            'num_people' => fake()->numberBetween(1, 5),
            'price' => fake()->randomFloat(2, 10, 500)
        ];
    }

    public function configure() {
        return $this->afterCreating(function (Booking $booking) {
            $booking->seats()->attach(Seat::inRandomOrder()->take(random_int(1, 5))->pluck('id'));
        });
    }
}
