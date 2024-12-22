<?php

namespace App\Http\Controllers\Main;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Main\StoreBookingRequest;
use App\Http\Requests\Main\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Showing;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    public function store(StoreBookingRequest $request) {
        try {
            $numPeople = count($request->input('seats'));
            $user = Auth::user();
            $booking = Booking::create([
                "showing_id" => $request->input('showing_id'),
                'num_people' => $numPeople,
                'price' => $numPeople * 31.5,
                'status' => BookingStatus::RESERVED->value,
                'user_id' => $user ? $user->id : null
            ]
            );
            $booking->seats()->sync($request->input('seats'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać rezerwacji'
            ]);
        }
        return redirect(route('main.bookings.edit', ['booking' => $booking->id]));
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
        if ($booking->status != BookingStatus::RESERVED->value)
            return redirect(route('main.showings.index'));

        return Inertia::render("Main/Booking/Edit", ['booking' => $booking->load(['showing', 'showing.movie', 'seats', 'showing.hall'])]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking) {
        $type = $request->input('_type');
        try {
            if ($type != 'fillData' || $booking->status != BookingStatus::RESERVED->value)
                return redirect(route('main.showings.index'));

            $booking->update([
                ...$request->validated(),
                'status' => BookingStatus::FILLED->value
            ]);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => "Wystąpił błąd, rezerwacja została anulowana",
                'messageType' => 'error',
            ]);
        }
        return redirect(route('main.showings.index'))->with([
            'message' => "Rezerwacja została ukończona",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Booking $booking) {
        try {
            $type = $request->input('type');
            if ($type == 'timeRunOut' && $booking->status == BookingStatus::PAID->value) {
                throw new Exception();
            }
            if ($type != 'timeRunOut' && ($booking->status == BookingStatus::PAID->value || $booking->user_id != Auth::user()->id)) {
                throw new Exception();
            }
            $booking->seats()->detach();
            $booking->delete();

            if ($type == "timeRunOut") {
                return redirect(route('main.showings.index'))->with([
                    'message' => "Rezerwacja została przerwana (czas się skończył)",
                    'messageType' => 'error',
                ]);
            } else {
                return redirect(route('main.showings.index'))->with([
                    'message' => "Rezerwacja została usunięta",
                    'messageType' => 'success'
                ]);
            }
            ;
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranej rezerwacji'
            ]);
        }
    }
}
