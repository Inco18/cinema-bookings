<?php

namespace Tests\Feature;

use App\Enums\BookingStatus;
use App\Models\Genre;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Price;
use App\Models\Seat;
use App\Models\Showing;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingControllerFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $hall;
    protected $showing;
    protected $seats;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PermissionSeeder::class);
        $this->seed(RoleSeeder::class);
        Genre::factory()->create();
        $movie = Movie::factory()->create();
        $this->hall = Hall::factory()->create();
        $this->seats = collect();
        foreach (range(1, 10) as $i) {
            $this->seats->push(Seat::factory()->create(['hall_id' => $this->hall->id]));
        }
        $this->showing = Showing::factory()->create([
            'hall_id' => $this->hall->id,
            'movie_id' => $movie->id,
            'start_time' => now()->addDays(2),
        ]);
        Price::unguard();
        Price::truncate();
        Price::create([
            'ticket_type' => 'normal',
            'base_price' => 30,
            'min_price' => 20,
            'max_price' => 40,
        ]);
        $this->user = User::factory()->create();
    }

    /** @test */
    public function user_can_create_and_delete_booking()
    {
        $this->actingAs($this->user);
        $response = $this->post(route('main.bookings.store'), [
            'showing_id' => $this->showing->id,
            'seats' => $this->seats->pluck('id')->take(2)->toArray(),
        ]);
        $response->assertRedirect();
        $booking = $this->user->bookings()->latest()->first();
        $this->assertNotNull($booking);
        $this->assertEquals(BookingStatus::RESERVED->value, $booking->status);

        $response = $this->delete(route('main.bookings.destroy', $booking), [
            'token' => $booking->token,
        ]);
        $response->assertRedirect(route('main.showings.index'));
        $this->assertDatabaseMissing('bookings', ['id' => $booking->id]);
    }

    /** @test */
    public function cannot_edit_booking_with_wrong_token()
    {
        $this->actingAs($this->user);
        $booking = $this->user->bookings()->create([
            'showing_id' => $this->showing->id,
            'price' => 0,
            'status' => BookingStatus::RESERVED->value,
            'token' => 'correcttoken',
        ]);
        $response = $this->get(route('main.bookings.edit_seats', $booking) . '?token=wrongtoken');
        $response->assertForbidden();
    }

    /** @test */
    public function cannot_download_tickets_for_unpaid_booking()
    {
        $this->actingAs($this->user);
        $booking = $this->user->bookings()->create([
            'showing_id' => $this->showing->id,
            'price' => 60,
            'status' => BookingStatus::RESERVED->value,
            'token' => 'tokentest',
        ]);
        $response = $this->get(route('main.bookings.tickets', $booking) . '?token=tokentest');
        $response->assertRedirect(route('main.showings.index'));
    }

    /** @test */
    public function cannot_delete_paid_booking()
    {
        $this->actingAs($this->user);
        $booking = $this->user->bookings()->create([
            'showing_id' => $this->showing->id,
            'price' => 60,
            'status' => BookingStatus::PAID,
            'token' => 'tokentest',
        ]);
        $response = $this->delete(route('main.bookings.destroy', $booking), [
            'token' => 'tokentest',
        ]);
        $response->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('bookings', ['id' => $booking->id]);
    }
}
