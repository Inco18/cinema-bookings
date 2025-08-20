<?php

namespace App\Rules;

use App\Models\Seat;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class ValidSeatsForShowing implements ValidationRule {
    protected $showingId;

    /**
     * Create a new rule instance.
     *
     * @param int $showingId
     */
    public function __construct($showingId) {
        $this->showingId = $showingId;
    }

    /**
     * Validate the attribute.
     *
     * @param  string  $attribute
     * @param  mixed   $value
     * @param  \Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void {
        if (!is_array($value)) {
            $fail(':attribute musi być tablicą id siedzeń');
            return;
        }


        $occupiedSeats = DB::table('bookings')
            ->join('tickets', 'bookings.id', '=', 'tickets.booking_id')
            ->where('bookings.showing_id', $this->showingId)
            ->pluck('tickets.seat_id')
            ->toArray();


        foreach ($value as $seatId) {
            if (in_array($seatId, $occupiedSeats)) {
                $seat = Seat::find($seatId);
                $fail("Siedzenie rząd:{$seat->row}, numer:{$seat->number} nie jest już dostępne dla wybranego seansu");
            }
        }
    }
}
