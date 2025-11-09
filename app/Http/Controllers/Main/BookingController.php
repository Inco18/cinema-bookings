<?php

namespace App\Http\Controllers\Main;

use App\Enums\BookingStatus;
use App\Enums\RewardType;
use App\Enums\RewardValueType;
use App\Enums\TicketType;
use App\Enums\UserRewardStatus;
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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
                'error' => 'Nie podano seansu do rezerwacji',
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
            Log::error('Error creating booking: '.$e->getMessage());

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
            $bookingDiscount = $booking->userRewards()->first();
            if ($bookingDiscount) {
                $bookingDiscount->update(['status' => UserRewardStatus::ACTIVE->value, 'booking_id' => null]);
            }
            $booking->seats()->detach();
            $booking->delete();

            Log::error('Error updating booking seats: '.$e->getMessage());

            return redirect(route('main.showings.index'))->with([
                'error' => 'Wystąpił błąd, rezerwacja została anulowana',
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
        $user = Auth::user();

        $dynamicPrices = $this->calculateDynamicPrices($booking->showing);
        $userDiscounts = $user ? $user->userRewards()->with('reward')->where('status', '=', UserRewardStatus::ACTIVE->value)->orWhere(function ($query) use ($booking) {
            $query->where('status', '=', UserRewardStatus::USED->value)->where('booking_id', '=', $booking->id);
        })->whereHas('reward', function ($query) {
            $query->where('type', '=', RewardType::DISCOUNT->value);
        })->orderBy('created_at', 'desc')->get() : collect();
        $selectedDiscountId = $booking->userRewards()->first()?->id;

        return Inertia::render('Main/Booking/ChooseTickets', [
            'booking' => $booking->load(['showing', 'showing.movie', 'seats', 'showing.hall']),
            'token' => $booking->token,
            'prices' => $dynamicPrices,
            'userDiscounts' => $userDiscounts,
            'selectedDiscountId' => $selectedDiscountId,
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
            DB::beginTransaction();
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
            $basePrice = $booking->seats->sum('pivot.price');
            $discountedPrice = null;

            $bookingDiscount = $booking->userRewards()->first();
            if ($bookingDiscount) {
                $bookingDiscount->update(['status' => UserRewardStatus::ACTIVE->value, 'booking_id' => null]);
            }

            if ($validated['selected_discount_id']) {
                $userReward = $booking->user ? $booking->user->userRewards()->where('id', '=', $validated['selected_discount_id'])->where('status', '=', UserRewardStatus::ACTIVE->value)->whereHas('reward', function ($query) {
                    $query->where('type', '=', RewardType::DISCOUNT->value);
                })->with('reward')->first() : null;
                if ($userReward) {
                    $discountValue = $userReward->reward->value;
                    if ($userReward->reward->value_type === RewardValueType::PERCENT->value) {
                        $discountedPrice = round($basePrice * (1 - $discountValue / 100), 2);
                    } else {
                        $discountedPrice = max(0, round($basePrice - $discountValue, 2));
                    }
                    $userReward->update(['status' => UserRewardStatus::USED->value, 'booking_id' => $booking->id]);
                }
            }
            $booking->update(['price' => $booking->seats->sum('pivot.price'), 'discounted_price' => $discountedPrice]);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $bookingDiscount = $booking->userRewards()->first();
            if ($bookingDiscount) {
                $bookingDiscount->update(['status' => UserRewardStatus::ACTIVE->value, 'booking_id' => null]);
            }
            $booking->seats()->detach();
            $booking->delete();

            Log::error('Error updating booking tickets: '.$e->getMessage());

            return redirect(route('main.showings.index'))->with([
                'error' => 'Wystąpił błąd, rezerwacja została anulowana',
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
            $bookingDiscount = $booking->userRewards()->first();
            if ($bookingDiscount) {
                $bookingDiscount->update(['status' => UserRewardStatus::ACTIVE->value, 'booking_id' => null]);
            }
            $booking->seats()->detach();
            $booking->delete();

            Log::error('Error updating booking: '.$e->getMessage());

            return redirect(route('main.showings.index'))->with([
                'error' => 'Wystąpił błąd, rezerwacja została anulowana',
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

            return redirect(route('main.bookings.confirmation', ['booking' => $booking, 'token' => urlencode($booking->token), 'points' => $pointsToAdd ?? 0]));
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

            Log::error('Error updating booking: '.$e->getMessage());

            return redirect(route('main.showings.index'))->with([
                'error' => 'Wystąpił błąd, rezerwacja została anulowana',
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
            $bookingDiscount = $booking->userRewards()->first();
            if ($bookingDiscount) {
                $bookingDiscount->update(['status' => UserRewardStatus::ACTIVE->value, 'booking_id' => null]);
            }
            $booking->seats()->detach();
            $booking->delete();

            if ($type == 'timeRunOut') {
                return redirect(route('main.showings.index'))->with([
                    'error' => 'Rezerwacja została przerwana (czas się skończył)',
                ]);
            } else {
                return redirect(route('main.showings.index'))->with([
                    'success' => 'Rezerwacja została usunięta',
                ]);
            }

        } catch (Exception $e) {
            Log::error('Error deleting booking: '.$e->getMessage());

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
            // Default base_price
            $finalPrice = $price->base_price;

            // If occupancy > 70% or screening < 24h, raise price to max 10% above base_price, but no more than max_price
            $soon = (strtotime($showing->start_time) - time()) < 60 * 60 * 24;
            if ($occupancy > 0.7 || $soon) {
                $dynamic = $price->base_price * 1.1;
                $finalPrice = min($dynamic, $price->max_price);
            }

            // If occupancy < 20%, lower price to min 10% below base_price, but no less than min_price
            if ($occupancy < 0.2) {
                $dynamic = $price->base_price * 0.9;
                $finalPrice = max($dynamic, $price->min_price);
            }

            // Round to two decimal places
            $prices[$ticketType] = round($finalPrice, 2);
        }

        return $prices;
    }
}
