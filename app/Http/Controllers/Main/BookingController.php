<?php

namespace App\Http\Controllers\Main;

use App\Enums\BookingStatus;
use App\Enums\TicketType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Main\StoreBookingRequest;
use App\Http\Requests\Main\UpdateBookingRequest;
use App\Http\Requests\Main\UpdateBookingSeatsRequest;
use App\Http\Requests\Main\UpdateTicketsRequest;
use App\Mail\BookingConfirmation;
use App\Models\Booking;
use App\Models\Price;
use App\Models\Showing;
use App\Services\PaynowService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Str;

use function Spatie\LaravelPdf\Support\pdf;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            return redirect(route('main.showings.index'));
        }
        $perPage = 10;
        $page = $request->query('page', 1);
        $bookings = Booking::with(['showing.movie', 'seats.hall'])->where('user_id', '=', $user->id)->latest('updated_at')->paginate($perPage);

        $isNextPageExists = $bookings->currentPage() < $bookings->lastPage();

        return Inertia::render('Main/Booking/Index', ['bookings' => Inertia::merge($bookings->items()), 'page' => $page,
            'isNextPageExists' => $isNextPageExists]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $showingId = $request->input('showing_id');
        if (! $showingId) {
            return redirect(route('main.showings.index'))->with([
                'message' => 'Nie podano seansu do rezerwacji',
                'messageType' => 'error',
            ]);
        }
        $showing = Showing::with(['hall.seats' => function ($query) {
            $query->orderBy('row')->orderBy('column');
        }, 'bookings.seats', 'movie'])->findOrFail($showingId);

        if ((new Carbon($showing->end_time))->isPast()) {
            return redirect(route('main.showings.index'));
        }

        return Inertia::render('Main/Booking/Create', ['showing' => $showing]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        try {
            $user = Auth::user();
            $booking = Booking::create([
                'showing_id' => $request->input('showing_id'),
                'price' => 0,
                'status' => BookingStatus::RESERVED->value,
                'user_id' => $user ? $user->id : null,
                'token' => Str::random(32),
            ]
            );
            $booking->seats()->syncWithPivotValues($request->input('seats'), ['price' => 0, 'type' => TicketType::NORMAL->value]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać rezerwacji',
            ]);
        }

        return redirect(route('main.bookings.chooseTickets', ['booking' => $booking->id, 'token' => $booking->token]));
    }

    public function editSeats(Booking $booking, Request $request)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        if ($booking->status != BookingStatus::RESERVED->value) {
            return redirect(route('main.showings.index'));
        }

        return Inertia::render('Main/Booking/EditSeats', ['showing' => $booking->showing->load(['hall.seats' => function ($query) {
            $query->orderBy('row')->orderBy('column');
        }, 'bookings.seats', 'movie']), 'seats' => $booking->seats->pluck('id'), 'booking' => $booking, 'token' => $booking->token]);
    }

    public function updateSeats(Booking $booking, UpdateBookingSeatsRequest $request)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        try {
            if ($booking->status != BookingStatus::RESERVED->value) {
                return redirect(route('main.showings.index'));
            }

            $booking->update([
                'price' => 0,
            ]);

            $booking->seats()->syncWithPivotValues($request->input('seats'), ['price' => 0, 'type' => TicketType::NORMAL->value]);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => 'Wystąpił błąd, rezerwacja została anulowana',
                'messageType' => 'error',
            ]);
        }

        return redirect(route('main.bookings.chooseTickets', ['booking' => $booking->id, 'token' => $booking->token]));
    }

    public function showChooseTickets(Booking $booking, Request $request)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        if ($booking->status != BookingStatus::RESERVED->value) {
            return redirect(route('main.showings.index'));
        }

        $dynamicPrices = $this->calculateDynamicPrices($booking->showing);

        return Inertia::render('Main/Booking/ChooseTickets', [
            'booking' => $booking->load(['showing', 'showing.movie', 'seats', 'showing.hall']),
            'token' => $booking->token,
            'prices' => $dynamicPrices,
        ]);
    }

    public function updateTickets(Booking $booking, UpdateTicketsRequest $request)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }
        $validated = $request->validated();
        $booking->load(['showing', 'showing.movie', 'seats', 'showing.hall']);
        $prices = $request->input('prices', [
            'normal' => 31.5,
            'reduced' => 25.0,
        ]);

        if ($booking->seats->count() != $validated['normal'] + $validated['reduced']) {
            return back()->withErrors([
                'tickets' => 'Liczba biletów nie zgadza się z liczbą wybranych miejsc',
            ]);
        }

        try {
            if ($booking->status != BookingStatus::RESERVED->value) {
                return redirect(route('main.showings.index'));
            }

            foreach ($booking->seats as $seat) {
                if ($validated['normal'] > 0) {
                    $seat->pivot->update(['type' => TicketType::NORMAL->value, 'price' => $prices['normal']]);
                    $validated['normal']--;
                } else {
                    $seat->pivot->update(['type' => TicketType::REDUCED->value, 'price' => $prices['reduced']]);
                    $validated['reduced']--;
                }
            }
            $booking->update(['price' => $booking->seats->sum('pivot.price')]);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => 'Wystąpił błąd, rezerwacja została anulowana',
                'messageType' => 'error',
            ]);
        }

        return redirect(route('main.bookings.edit', ['booking' => $booking->id, 'token' => $booking->token]));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking, Request $request)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        if ($booking->status != BookingStatus::RESERVED->value) {
            return redirect(route('main.showings.index'));
        }

        return Inertia::render('Main/Booking/Edit', ['booking' => $booking->load(['showing', 'showing.movie', 'seats', 'showing.hall']), 'token' => $booking->token]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking, PaynowService $paynowService)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        $type = $request->input('_type');
        try {
            if ($type != 'fillData' || $booking->status != BookingStatus::RESERVED->value) {
                return redirect(route('main.showings.index'));
            }

            $booking->update([
                ...$request->validated(),
                'status' => BookingStatus::FILLED->value,
            ]);

            $redirectUrl = $paynowService->makePayment($booking, $booking->token);

            if (! $redirectUrl) {
                throw new Exception('Wystąpił błąd w czasie płatności');
            }

            return Inertia::location($redirectUrl);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => 'Wystąpił błąd, rezerwacja została anulowana',
                'messageType' => 'error',
            ]);
        }
    }

    public function handlePaymentResponse(Booking $booking, Request $request, PaynowService $paynowService)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        $paymentId = $request->paymentId;
        $paymentStatus = $paynowService->getStatus($paymentId)->getStatus();
        $booking->update(['payment_id' => $paymentId]);

        if ($paymentStatus == 'CONFIRMED') {
            $booking->update(['status' => BookingStatus::PAID->value]);
            Mail::to($booking->email)->queue(new BookingConfirmation($booking));
            $user = Auth::user();
            if ($user) {
                $pointsToAdd = floor($booking->price / 10);
                $user->increment('points_number', $pointsToAdd);
                $user->pointsHistory()->create([
                    'points_change' => $pointsToAdd,
                    'booking_id' => $booking->id,
                    'description' => 'Punkty za rezerwację #'.$booking->id,
                ]);
            }

            return redirect(route('main.bookings.confirmation', ['booking' => $booking, 'token' => urlencode($booking->token), 'points' => $pointsToAdd]));
        }

        if ($paymentStatus == 'PENDING') {
            return Inertia::render('Main/Booking/Pending', [
                'booking' => $booking,
                'token' => urlencode($booking->token),
            ]);
        }

        if ($paymentStatus == 'REJECTED' || $paymentStatus == 'ERROR') {

            return Inertia::render('Main/Booking/Error', [
                'booking' => $booking,
                'token' => urlencode($booking->token),
            ]);
        }
    }

    public function retryPayment(Booking $booking, Request $request, PaynowService $paynowService)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        try {
            if ($booking->status != BookingStatus::FILLED->value) {
                return redirect(route('main.showings.index'));
            }

            $redirectUrl = $paynowService->makePayment($booking, $booking->token);

            if (! $redirectUrl) {
                throw new Exception('Wystąpił błąd w czasie płatności');
            }

            return Inertia::location($redirectUrl);
        } catch (Exception $e) {
            $booking->seats()->detach();
            $booking->delete();

            return redirect(route('main.showings.index'))->with([
                'message' => 'Wystąpił błąd, rezerwacja została anulowana',
                'messageType' => 'error',
            ]);
        }
    }

    public function showConfirmation(Request $request, Booking $booking)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        return Inertia::render('Main/Booking/Confirmation', [
            'booking' => $booking,
            'token' => urlencode($booking->token),
        ]);
    }

    public function downloadTickets(Request $request, Booking $booking)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        if ($booking->status != BookingStatus::PAID->value) {
            return redirect(route('main.showings.index'));
        }

        return pdf()->view('tickets', ['booking' => $booking->load(['seats', 'showing', 'showing.movie', 'showing.hall'])])->margins(5, 5, 5, 5)->name("bilety-{$booking->id}.pdf");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Booking $booking)
    {
        if ($request->input('token') != $booking->token) {
            abort(403, 'Nieprawidłowy token');
        }

        try {
            $type = $request->input('type');
            if ($type == 'timeRunOut' && $booking->status == BookingStatus::PAID->value) {
                throw new Exception;
            }
            if ($type != 'timeRunOut' && ($booking->status == BookingStatus::PAID->value || (isset($booking->user_id) && $booking->user_id != Auth::user()->id))) {
                throw new Exception;
            }
            $booking->seats()->detach();
            $booking->delete();

            if ($type == 'timeRunOut') {
                return redirect(route('main.showings.index'))->with([
                    'message' => 'Rezerwacja została przerwana (czas się skończył)',
                    'messageType' => 'error',
                ]);
            } else {
                return redirect(route('main.showings.index'))->with([
                    'message' => 'Rezerwacja została usunięta',
                    'messageType' => 'success',
                ]);
            }

        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranej rezerwacji',
            ]);
        }
    }

    public function calculateDynamicPrices(Showing $showing)
    {
        $prices = [];
        $priceModels = Price::all()->keyBy('ticket_type');
        $seatsCount = $showing->hall->seats()->count();
        $bookedSeats = $showing->bookings()->withCount('seats')->get()->sum('seats_count');
        $occupancy = $seatsCount > 0 ? $bookedSeats / $seatsCount : 0;

        foreach ($priceModels as $ticketType => $price) {
            // Domyślnie base_price
            $finalPrice = $price->base_price;

            // Jeśli obłożenie > 70% lub seans za < 24h, podnieś cenę do max 10% powyżej base_price, ale nie więcej niż max_price
            $soon = (strtotime($showing->start_time) - time()) < 60 * 60 * 24;
            if ($occupancy > 0.7 || $soon) {
                $dynamic = $price->base_price * 1.1;
                $finalPrice = min($dynamic, $price->max_price);
            }

            // Jeśli obłożenie < 20%, obniż cenę do min 10% poniżej base_price, ale nie mniej niż min_price
            if ($occupancy < 0.2) {
                $dynamic = $price->base_price * 0.9;
                $finalPrice = max($dynamic, $price->min_price);
            }

            // Zaokrąglij do dwóch miejsc
            $prices[$ticketType] = round($finalPrice, 2);
        }

        return $prices;
    }
}
