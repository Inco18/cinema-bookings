<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SeatController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        Gate::authorize('viewAny', Seat::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $hallSearch = $request->get('hallSearch');
        $rowSearch = $request->get('rowSearch');
        $colSearch = $request->get('colSearch');
        $typeFilter = $request->get('typeFilter');
        $seats = Seat::with('hall');

        if ($hallSearch) {
            $seats->whereHas('hall', function ($q) use ($hallSearch) {
                $q->where('number', 'ilike', $hallSearch);
            });
        }
        if ($rowSearch) {
            $seats->where('row', 'ilike', $rowSearch);
        }
        if ($colSearch) {
            $seats->where('column', 'ilike', $colSearch);
        }
        if ($typeFilter) {
            $seats->whereIn('type', $typeFilter);
        }

        if ($sortBy) {
            $seats->orderBy($sortBy, $sortDesc ? 'desc' : 'asc')->orderBy('hall_id');
        } else {
            $seats->orderBy('hall_id')->orderBy('row')->orderBy('column');
        }

        $rowCount = $seats->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $seats = $seats->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Seats/Index', [
            'seats' => $seats,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'hallSearch' => $hallSearch,
            'rowSearch' => $rowSearch,
            'colSearch' => $colSearch,
            'typeFilter' => $typeFilter
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
    public function show(Seat $seat) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Seat $seat) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seat $seat) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seat $seat) {
        //
    }
}
