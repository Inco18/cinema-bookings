<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PointsHistoryRequest;
use App\Models\User;
use App\Models\PointsHistory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PointsHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', PointsHistory::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $userSearch = $request->get('userSearch');
        $descriptionSearch = $request->get('descriptionSearch');
        $pointsHistory = PointsHistory::with(['user', 'booking', 'userReward']);

        if ($userSearch) {
            $pointsHistory->whereHas('user', function ($q) use ($userSearch) {
                $q->whereAny(['first_name', 'last_name', 'email'], 'ilike', "%$userSearch%");
            });
        }
        if ($descriptionSearch) {
            $pointsHistory->where('description', 'ilike', "%$descriptionSearch%");
        }

        if ($sortBy) {
            $pointsHistory->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        } else {
            $pointsHistory->orderBy('created_at', 'desc');
        }

        $rowCount = $pointsHistory->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10) {
            $page = ceil($rowCount / 10);
        }
        if ($page < 1) {
            $page = 1;
        }

        $pointsHistory = $pointsHistory->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/PointsHistory/Index', [
            'pointsHistory' => $pointsHistory,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'userSearch' => $userSearch,
            'descriptionSearch' => $descriptionSearch,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', PointsHistory::class);
        $users = User::orderBy('first_name')->orderBy('last_name')->get();

        return Inertia::render('Admin/PointsHistory/Form', ['users' => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PointsHistoryRequest $request)
    {
        Gate::authorize('create', PointsHistory::class);
        try {
            PointsHistory::create($request->validated());
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać wpisu historii punktów',
            ]);
        }

        return redirect(route('pointsHistory.index'))->with([
            'success' => 'Wpis historii punktów został dodany',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PointsHistory $pointsHistory)
    {
        Gate::authorize('update', $pointsHistory);
        $users = User::orderBy('first_name')->orderBy('last_name')->get();

        return Inertia::render('Admin/PointsHistory/Form', ['pointsHistory' => $pointsHistory, 'users' => $users]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PointsHistoryRequest $request, PointsHistory $pointsHistory)
    {
        Gate::authorize('update', $pointsHistory);
        try {
            $pointsHistory->update($request->validated());
        } catch (Exception $e) {

            return redirect()->back()->withErrors([
                'create' => 'Nie udało się zaktualizować wybranego wpisu historii punktów',
            ]);
        }

        return redirect(route('pointsHistory.index'))->with([
            'success' => 'Wpis historii punktów został zaktualizowany',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PointsHistory $pointsHistory)
    {
        Gate::authorize('delete', $pointsHistory);
        try {
            $pointsHistory->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranego wpisu historii punktów',
            ]);
        }

        return back()->with([
            'success' => 'Wpis historii punktów został usunięty',
        ]);
    }
}
