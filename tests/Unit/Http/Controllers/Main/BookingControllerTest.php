<?php

namespace Tests\Unit\Http\Controllers\Main;

use App\Enums\BookingStatus;
use App\Http\Controllers\Main\BookingController;
use App\Models\Booking;
use App\Models\Genre;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Price;
use App\Models\Seat;
use App\Models\Showing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $hall;

    protected function setUp(): void
    {
        parent::setUp();
        Genre::factory(10)->create();
        Movie::factory(10)->create();
        $this->hall = Hall::factory()->create();
        foreach (range(1, 100) as $i) {
            Seat::factory()->create(['hall_id' => $this->hall->id]);
        }
        Price::unguard();
        Price::truncate();
        Price::create([
            'ticket_type' => 'normal',
            'base_price' => 30,
            'min_price' => 20,
            'max_price' => 40,
        ]);
    }

    /** @test */
    public function it_returns_base_price_when_occupancy_is_normal_and_showing_is_not_soon()
    {
        $showing = $this->createShowingWithOccupancy(0.5, '+2 days');
        $controller = new BookingController;
        $prices = $controller->calculateDynamicPrices($showing);
        $this->assertEquals(30.00, $prices['normal']);
    }

    /** @test */
    public function it_increases_price_when_occupancy_is_high()
    {
        Price::where('ticket_type', 'normal')->update(['max_price' => 32]);
        $showing = $this->createShowingWithOccupancy(0.8, '+2 days');
        $controller = new BookingController;
        $prices = $controller->calculateDynamicPrices($showing);
        $this->assertEquals(32.00, $prices['normal']);
    }

    /** @test */
    public function it_increases_price_when_showing_is_soon()
    {
        $showing = $this->createShowingWithOccupancy(0.5, '+10 hours');
        $controller = new BookingController;
        $prices = $controller->calculateDynamicPrices($showing);
        $this->assertEquals(33.00, $prices['normal']);
    }

    /** @test */
    public function it_decreases_price_when_occupancy_is_low()
    {
        Price::where('ticket_type', 'normal')->update(['min_price' => 25]);
        $showing = $this->createShowingWithOccupancy(0.1, '+2 days');
        $controller = new BookingController;
        $prices = $controller->calculateDynamicPrices($showing);
        $this->assertEquals(27.00, $prices['normal']);
    }

    /** @test */
    public function it_does_not_decrease_below_min_price()
    {
        Price::where('ticket_type', 'normal')->update(['min_price' => 29]);
        $showing = $this->createShowingWithOccupancy(0.1, '+2 days');
        $controller = new BookingController;
        $prices = $controller->calculateDynamicPrices($showing);
        $this->assertEquals(29.00, $prices['normal']);
    }

    private function createShowingWithOccupancy($occupancy, $startTimeMod)
    {
        $showing = Showing::factory()->create([
            'hall_id' => $this->hall->id,
            'start_time' => now()->modify($startTimeMod),
        ]);
        $seats = $this->hall->seats;
        $bookedCount = (int) ($seats->count() * $occupancy);
        if ($bookedCount > 0) {
            $booking = Booking::factory()->create([
                'showing_id' => $showing->id,
                'status' => BookingStatus::PAID,
            ]);
            $booking->seats()->syncWithPivotValues($seats->take($bookedCount)->pluck('id')->toArray(), ['price' => 30, 'type' => 'normal']);
        }

        return $showing->fresh();
    }
}
