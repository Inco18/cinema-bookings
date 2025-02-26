<?php

namespace App\Http\Controllers\Main;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Main\StoreBookingRequest;
use App\Http\Requests\Main\UpdateBookingRequest;
use App\Http\Requests\Main\UpdateBookingSeatsRequest;
use App\Mail\BookingConfirmation;
use App\Models\Booking;
use App\Models\Showing;
use App\Services\PaynowService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Str;

use function Spatie\LaravelPdf\Support\pdf;

class BookingController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $user = Auth::user();
        $perPage = 10;
        $page = $request->query('page', 1);
        $bookings = Booking::with(['showing.movie', 'seats.hall'])->where('user_id', '=', $user->id)->latest('updated_at')->paginate($perPage);

        $isNextPageExists = $bookings->currentPage() < $bookings->lastPage();

        return Inertia::render("Main/Booking/Index", ['bookings' => Inertia::merge($bookings->items()), 'page' => $page,
            'isNextPageExists' => $isNextPageExists]);
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

        if ((new Carbon($showing->end_time))->isPast()) {
            return redirect(route("main.showings.index"));
        }

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
                'user_id' => $user ? $user->id : null,
                'token' => Str::random(32)
            ]
            );
            $booking->seats()->sync($request->input('seats'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać rezerwacji'
            ]);
        }
        return redirect(route('main.bookings.edit', ['booking' => $booking->id, 'token' => $booking->token]));
    }

    public function editSeats(Booking $booking, Request $request) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        if ($booking->status != BookingStatus::RESERVED->value)
            return redirect(route('main.showings.index'));

        return Inertia::render("Main/Booking/EditSeats", ['showing' => $booking->showing->load(['hall.seats' => function ($query) {
            $query->orderBy('row')->orderBy('column');
        }, 'bookings.seats', 'movie']), 'seats' => $booking->seats->pluck('id'), 'booking' => $booking, 'token' => $booking->token]);
    }

    public function updateSeats(Booking $booking, UpdateBookingSeatsRequest $request) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        try {
            if ($booking->status != BookingStatus::RESERVED->value)
                return redirect(route('main.showings.index'));

            $numPeople = count($request->input('seats'));

            $booking->update([
                'num_people' => $numPeople,
                'price' => $numPeople * 31.5,
            ]);

            $booking->seats()->sync($request->input('seats'));
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => "Wystąpił błąd, rezerwacja została anulowana",
                'messageType' => 'error',
            ]);
        }
        return redirect(route('main.bookings.edit', ['booking' => $booking->id, 'token' => $booking->token]));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking, Request $request) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        if ($booking->status != BookingStatus::RESERVED->value)
            return redirect(route('main.showings.index'));

        return Inertia::render("Main/Booking/Edit", ['booking' => $booking->load(['showing', 'showing.movie', 'seats', 'showing.hall']), 'token' => $booking->token]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking, PaynowService $paynowService) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        $type = $request->input('_type');
        try {
            if ($type != 'fillData' || $booking->status != BookingStatus::RESERVED->value)
                return redirect(route('main.showings.index'));

            $booking->update([
                ...$request->validated(),
                'status' => BookingStatus::FILLED->value
            ]);

            $redirectUrl = $paynowService->makePayment($booking, $booking->token);

            if (!$redirectUrl)
                throw new Exception("Wystąpił błąd w czasie płatności");

            return Inertia::location($redirectUrl);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => "Wystąpił błąd, rezerwacja została anulowana",
                'messageType' => 'error',
            ]);
        }
    }

    public function handlePaymentResponse(Booking $booking, Request $request, PaynowService $paynowService) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        $paymentId = $request->paymentId;
        $paymentStatus = $paynowService->getStatus($paymentId)->getStatus();
        $booking->update(['payment_id' => $paymentId]);

        if ($paymentStatus == 'CONFIRMED') {
            $booking->update(['status' => BookingStatus::PAID->value]);
            Mail::to($booking->email)->queue(new BookingConfirmation($booking));

            return redirect(route('main.bookings.confirmation', ['booking' => $booking, 'token' => urlencode($booking->token)]));
        }

        if ($paymentStatus == 'PENDING') {
            return Inertia::render("Main/Booking/Pending", [
                'booking' => $booking,
                'token' => urlencode($booking->token)
            ]);
        }

        if ($paymentStatus == 'REJECTED' || $paymentStatus == 'ERROR') {

            return Inertia::render("Main/Booking/Error", [
                'booking' => $booking,
                'token' => urlencode($booking->token)
            ]);
        }
    }

    public function retryPayment(Booking $booking, Request $request, PaynowService $paynowService) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        try {
            if ($booking->status != BookingStatus::FILLED->value)
                return redirect(route('main.showings.index'));

            $redirectUrl = $paynowService->makePayment($booking, $booking->token);

            if (!$redirectUrl)
                throw new Exception("Wystąpił błąd w czasie płatności");

            return Inertia::location($redirectUrl);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => "Wystąpił błąd, rezerwacja została anulowana",
                'messageType' => 'error',
            ]);
        }
    }

    public function showConfirmation(Request $request, Booking $booking) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        return Inertia::render("Main/Booking/Confirmation", [
            'booking' => $booking,
            'token' => urlencode($booking->token)
        ]);
    }

    public function downloadTickets(Request $request, Booking $booking) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        if ($booking->status != BookingStatus::PAID->value)
            return redirect(route('main.showings.index'));

        return pdf()->view("tickets", ['booking' => $booking->load(['seats', 'showing', 'showing.movie', 'showing.hall'])])->margins(5, 5, 5, 5)->name("bilety-{$booking->id}.pdf");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Booking $booking) {
        if ($request->input('token') != $booking->token)
            abort(403, 'Nieprawidłowy token');

        try {
            $type = $request->input('type');
            if ($type == 'timeRunOut' && $booking->status == BookingStatus::PAID->value) {
                throw new Exception();
            }
            if ($type != 'timeRunOut' && ($booking->status == BookingStatus::PAID->value || (isset($booking->user_id) && $booking->user_id != Auth::user()->id))) {
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
