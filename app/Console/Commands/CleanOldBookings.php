<?php

namespace App\Console\Commands;

use App\Enums\BookingStatus;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanOldBookings extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:clean-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes rows older than 15 minutes that are not paid form bookings';

    /**
     * Execute the console command.
     */
    public function handle() {
        $threshold = Carbon::now()->subMinutes(15);

        // Pobierz IDs rekordów do usunięcia
        $bookingIds = DB::table('bookings')
            ->where('updated_at', '<', $threshold)
            ->where('status', '!=', BookingStatus::PAID->value)
            ->pluck('id'); // Pobiera listę identyfikatorów rekordów

        if ($bookingIds->isEmpty()) {
            $this->info("Brak rekordów do usunięcia.");
            return;
        }

        DB::transaction(function () use ($bookingIds) {
            // Usuń powiązane rekordy w tabeli pivot
            $deletedSeats = DB::table('booking_seat')
                ->whereIn('booking_id', $bookingIds)
                ->delete();

            // Usuń rekordy w tabeli bookings
            $deletedBookings = DB::table('bookings')
                ->whereIn('id', $bookingIds)
                ->delete();

            $this->info("Usunięto $deletedSeats rekord(ów) w tabeli booking_seat.");
            $this->info("Usunięto $deletedBookings rekord(ów) w tabeli bookings.");
        });
    }
}
