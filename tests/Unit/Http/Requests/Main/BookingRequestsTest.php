<?php

namespace Tests\Unit\Http\Requests\Main;

use App\Http\Requests\Main\StoreBookingRequest;
use App\Http\Requests\Main\UpdateBookingRequest;
use App\Http\Requests\Main\UpdateBookingSeatsRequest;
use App\Http\Requests\Main\UpdateTicketsRequest;
use App\Models\Genre;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Seat;
use App\Models\Showing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingRequestsTest extends TestCase
{
    use RefreshDatabase;

    protected $hall;

    protected $showing;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a hall and seats for all tests
        Genre::factory(10)->create();
        Movie::factory(10)->create();
        $this->hall = Hall::factory()->create();
        foreach (range(1, 100) as $i) {
            Seat::factory()->create(['hall_id' => $this->hall->id]);
        }
        $this->showing = Showing::factory()->create([
            'hall_id' => $this->hall->id,
            'start_time' => now()->modify('+2 days'),
        ]);
    }

    /** @test */
    public function store_booking_request_accepts_valid_data()
    {
        $request = StoreBookingRequest::create('/', 'POST', [
            'showing_id' => $this->showing->id,
            'seats' => $this->hall->seats()->pluck('id')->take(2)->toArray(), // Take first 2 seats
        ]);
        $rules = (new StoreBookingRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function store_booking_request_rejects_duplicate_seats()
    {
        $request = StoreBookingRequest::create('/', 'POST', [
            'showing_id' => 1,
            'seats' => [10, 10],
        ]);
        $rules = (new StoreBookingRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('seats.0', $validator->errors()->toArray());
    }

    /** @test */
    public function update_booking_seats_request_requires_seats()
    {
        $request = UpdateBookingSeatsRequest::create('/', 'POST', [
            'seats' => [],
        ]);
        $rules = (new UpdateBookingSeatsRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('seats', $validator->errors()->toArray());
    }

    /** @test */
    public function update_booking_request_validates_email_and_names()
    {
        $request = UpdateBookingRequest::create('/', 'POST', [
            'first_name' => 'Jan',
            'last_name' => 'Kowalski',
            'email' => 'jan@kowalski.pl',
        ]);
        $rules = (new UpdateBookingRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function update_booking_request_rejects_invalid_email()
    {
        $request = UpdateBookingRequest::create('/', 'POST', [
            'first_name' => 'Jan',
            'last_name' => 'Kowalski',
            'email' => 'not-an-email',
        ]);
        $rules = (new UpdateBookingRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    /** @test */
    public function update_tickets_request_accepts_valid_data()
    {
        $request = UpdateTicketsRequest::create('/', 'POST', [
            'normal' => 2,
            'reduced' => 1,
            'selected_discount_id' => null,
        ]);
        $rules = (new UpdateTicketsRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function update_tickets_request_rejects_negative_values()
    {
        $request = UpdateTicketsRequest::create('/', 'POST', [
            'normal' => -1,
            'reduced' => 0,
        ]);
        $rules = (new UpdateTicketsRequest)->rules();
        $validator = validator($request->all(), $rules);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('normal', $validator->errors()->toArray());
    }
}
