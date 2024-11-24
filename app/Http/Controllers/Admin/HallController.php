<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HallRequest;
use App\Models\Hall;
use App\Models\Seat;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HallController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        Gate::authorize('viewAny', Hall::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $halls = Hall::query();

        if ($search) {
            $halls->whereAny(['number', 'type'], 'ilike', "%$search%");
        }

        if ($sortBy) {
            $halls->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        } else {
            $halls->orderBy('number', 'asc');
        }

        $rowCount = $halls->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $halls = $halls->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Halls/Index', [
            'halls' => $halls,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'search' => $search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        Gate::authorize('create', Hall::class);

        return Inertia::render('Admin/Halls/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HallRequest $request) {
        Gate::authorize('create', Hall::class);
        try {
            Hall::create($request->only('number', 'type'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać sali'
            ]);
        }
        return redirect(route('halls.index'))->with([
            'message' => "Sala została dodana",
            'messageType' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hall $hall) {
        Gate::authorize('update', $hall);
        return Inertia::render('Admin/Halls/Form', ['hall' => $hall, 'seats' => $hall->seats]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HallRequest $request, Hall $hall) {
        Gate::authorize('update', $hall);
        try {
            $hall->update(
                $request->only('number', 'type')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'update' => 'Nie udało się zaktualizować wybranej sali'
            ]);
        }
        return redirect(route('halls.index'))->with([
            'message' => "Sala została zaktualizowana",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hall $hall) {
        Gate::authorize('delete', $hall);
        try {
            $hall->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranej sali'
            ]);
        }
    }
}
