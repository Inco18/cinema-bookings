<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Showing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request) {
        $showingId = $request->input('showing_id');
        if (!$showingId) {
            return redirect(route("main.showings.index"))->with([
                'message' => "Nie podano seansu do rezerwacji",
                'messageType' => 'error'
            ]);
        }
        $showing = Showing::with(['hall.seats' => function ($query) {
            $query->orderBy('row')->orderBy('column');
        }, 'bookings.seats', 'movie'])->findOrFail($showingId);

        return Inertia::render("Main/Booking/Create", ['showing' => $showing]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking) {
        //
    }
}
