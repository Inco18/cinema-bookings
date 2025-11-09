<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates a trigger in PostgreSQL that checks if a given seat
     * is already reserved for a specific showing.
     * Trigger is executed before INSERT and UPDATE on the tickets table.
     */
    public function up(): void
    {
        // Trigger function - checks uniqueness (seat_id, showing_id)
        DB::statement("
            CREATE OR REPLACE FUNCTION check_seat_availability()
            RETURNS TRIGGER AS $$
            DECLARE
                showing_id_var BIGINT;
                seat_count INT;
            BEGIN
                -- Get showing_id from related booking
                SELECT showing_id INTO showing_id_var
                FROM bookings
                WHERE id = NEW.booking_id;

                -- Check if this seat is already taken for this showing
                SELECT COUNT(*) INTO seat_count
                FROM tickets t
                JOIN bookings b ON t.booking_id = b.id
                WHERE t.seat_id = NEW.seat_id
                  AND b.showing_id = showing_id_var
                  AND t.id != COALESCE(NEW.id, 0); -- Exclude currently edited record

                IF seat_count > 0 THEN
                    RAISE EXCEPTION 'Seat % is already reserved for showing %', NEW.seat_id, showing_id_var;
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ");

        // Trigger is executed before INSERT and UPDATE on tickets
        DB::statement('
            CREATE TRIGGER ensure_unique_seat_per_showing
            BEFORE INSERT OR UPDATE ON tickets
            FOR EACH ROW
            EXECUTE FUNCTION check_seat_availability();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS ensure_unique_seat_per_showing ON tickets');
        DB::statement('DROP FUNCTION IF EXISTS check_seat_availability()');
    }
};
