<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SeatType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HallRequest;
use App\Models\Hall;
use App\Models\Seat;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HallController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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
        if ($page > $rowCount / 10) {
            $page = ceil($rowCount / 10);
        }
        if ($page < 1) {
            $page = 1;
        }

        $halls = $halls->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Halls/Index', [
            'halls' => $halls,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Hall::class);

        return Inertia::render('Admin/Halls/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HallRequest $request)
    {
        Gate::authorize('create', Hall::class);
        try {
            DB::beginTransaction();
            $hall = Hall::create($request->only('number', 'type'));
            if ($request->hasFile('planFile')) {
                $file = $request->file('planFile');
                $lines = file($file->getRealPath(), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

                $map = [
                    'N' => SeatType::NORMAL->value,
                    'L' => SeatType::WIDE_TO_RIGHT->value,
                    'R' => SeatType::WIDE_TO_LEFT->value,
                    'D' => SeatType::DISABLED->value,
                    'V' => SeatType::VIP->value,
                ];

                foreach ($lines as $rowIdx => $line) {
                    $cols = preg_split('/\s+/', trim($line));
                    $numberInRow = 1;
                    foreach ($cols as $colIdx => $code) {
                        if ($code === '.' || $code === '') {
                            continue;
                        }
                        if (! isset($map[$code])) {
                            continue;
                        }

                        Seat::create([
                            'hall_id' => $hall->id,
                            'type' => $map[$code],
                            'row' => $rowIdx + 1,
                            'column' => $colIdx + 1,
                            'number' => $numberInRow++,
                        ]);
                    }
                }
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać sali',
            ]);
        }

        return redirect(route('halls.index'))->with([
            'message' => 'Sala została dodana',
            'messageType' => 'success',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hall $hall)
    {
        Gate::authorize('update', $hall);

        return Inertia::render('Admin/Halls/Form', ['hall' => $hall, 'seats' => $hall->seats]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HallRequest $request, Hall $hall)
    {
        Gate::authorize('update', $hall);
        try {
            $hall->update(
                $request->only('number', 'type')
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'update' => 'Nie udało się zaktualizować wybranej sali',
            ]);
        }

        return redirect(route('halls.index'))->with([
            'message' => 'Sala została zaktualizowana',
            'messageType' => 'success',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hall $hall)
    {
        Gate::authorize('delete', $hall);
        try {
            $hall->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranej sali',
            ]);
        }
    }
}
