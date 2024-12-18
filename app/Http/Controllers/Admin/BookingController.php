<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BookingRequest;
use App\Models\Booking;
use App\Models\Showing;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BookingController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        Gate::authorize('viewAny', Booking::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $showingIdSearch = $request->get('showingIdSearch');
        $movieSearch = $request->get('movieSearch');
        $personSearch = $request->get('personSearch');
        $hallSearch = $request->get('hallSearch');
        $statusFilter = $request->get('statusFilter');
        $bookings = Booking::with(['showing', 'showing.movie', 'showing.hall', 'seats']);

        if ($showingIdSearch && is_numeric($showingIdSearch)) {
            $bookings->where('showing_id', '=', $showingIdSearch);
        }
        if ($movieSearch) {
            $bookings->whereHas('showing.movie', function ($q) use ($movieSearch) {
                $q->where('title', 'ilike', "%$movieSearch%");
            });
        }
        if ($personSearch) {
            $bookings->whereRaw("CONCAT(first_name, ' ', last_name) ILIKE '%$personSearch%' ");
        }
        if ($hallSearch) {
            $bookings->whereHas('showing.hall', function ($q) use ($hallSearch) {
                $q->where('number', 'ilike', $hallSearch);
            });
        }
        if ($statusFilter) {
            $bookings->whereIn('status', $statusFilter);
        }

        if (in_array($sortBy, ['num_people', 'price', 'status'])) {
            $bookings->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        } else if ($sortBy == 'person') {
            $bookings->orderByRaw(sql: "CONCAT(first_name, ' ', last_name) " . ($sortDesc ? "DESC" : "ASC"));
        }

        $rowCount = $bookings->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $bookings = $bookings->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'showingIdSearch' => $showingIdSearch,
            'movieSearch' => $movieSearch,
            'personSearch' => $personSearch,
            'hallSearch' => $hallSearch,
            'statusFilter' => $statusFilter
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request) {
        Gate::authorize('create', Booking::class);
        $showings = Showing::with(['movie', 'hall'])->where('end_time', '>=', Carbon::now())->orderBy('end_time')->get();
        $users = User::orderBy('first_name')->orderBy('last_name')->get();
        $showing_id = $request->input('showing_id') ?? $showings[0]->id;

        return Inertia::render('Admin/Bookings/Form', [
            'showings' => $showings,
            'users' => $users,
            'showing_id' => $showing_id,
            'hall' => fn() => Showing::find($showing_id)->hall()->with('seats')->first(),
            'bookings' => fn() => Showing::find($showing_id)->bookings()->with('seats')->get()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookingRequest $request) {
        Gate::authorize('create', Booking::class);
        try {
            $booking = Booking::create($request->validated());
            $booking->seats()->sync($request->input('seats'));
        } catch (Exception $e) {
            dd($e);
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać rezerwacji'
            ]);
        }
        return redirect(route('bookings.index'))->with([
            'message' => "Rezerwacja została dodana",
            'messageType' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Booking $booking) {
        Gate::authorize('create', Booking::class);
        $showings = Showing::with(['movie', 'hall'])->orderBy('end_time')->get();
        $users = User::orderBy('first_name')->orderBy('last_name')->get();
        $showing_id = $request->input('showing_id') ?? $booking->showing_id;

        return Inertia::render('Admin/Bookings/Form', ['booking' => $booking->load('seats'),
            'showings' => $showings,
            'users' => $users,
            'showing_id' => $showing_id,
            'hall' => fn() => Showing::find($showing_id)->hall()->with('seats')->first(),
            'bookings' => fn() => Showing::find($showing_id)->bookings()->with('seats')->get()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BookingRequest $request, Booking $booking) {
        Gate::authorize('update', $booking);
        try {
            $booking->update($request->validated());
            $booking->seats()->sync($request->input('seats'));
        } catch (Exception $e) {
            dd($e);
            return redirect()->back()->withErrors([
                'update' => 'Nie udało się zaktualizować rezerwacji'
            ]);
        }
        return redirect(route('bookings.index'))->with([
            'message' => "Rezerwacja została zaktualizowana",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking) {
        Gate::authorize('delete', $booking);
        try {
            $booking->seats()->detach();
            $booking->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranej rezerwacji'
            ]);
        }
    }
}
