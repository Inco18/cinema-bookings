<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
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

        if ($showingIdSearch) {
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
    public function create() {
        //
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
