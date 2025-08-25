<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Enums\TicketType;
use App\Models\Booking;
use App\Models\Seat;
use App\Models\Showing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $showings = Showing::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        return [
            'showing_id' => fake()->randomElement($showings),
            'user_id' => fake()->randomElement($users),
            'price' => fake()->randomFloat(2, 10, 500),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->email(),
            'status' => BookingStatus::PAID,
            'token' => Str::random(32),
        ];
    }

    public function configure()
    {
        $rand = random_int(1, 5);
        return $this->afterCreating(function (Booking $booking) use ($rand) {
            if($booking->user_id) {
                $booking->user->increment('points_number', floor($booking->price / 10));
                $booking->user->pointsHistory()->create([
                    'booking_id' => $booking->id,
                    'points_change' => floor($booking->price / 10),
                    'description' => 'Punkty za rezerwację #' . $booking->id,
                ]);
            }
            $booking->seats()->attach(Seat::where('hall_id', '=', $booking->showing->hall_id)->inRandomOrder()->take($rand)->pluck('id'), ['price' => $booking->price / $rand, 'type' => TicketType::NORMAL->value]);
        });
    }
}
