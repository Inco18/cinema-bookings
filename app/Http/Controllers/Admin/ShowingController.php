<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ShowingRequest;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Showing;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ShowingController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        Gate::authorize('viewAny', Showing::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $movieSearch = $request->get('movieSearch');
        $hallSearch = $request->get('hallSearch');
        $speechSearch = $request->get('speechSearch');
        $dubbingSearch = $request->get('dubbingSearch');
        $subtitlesSearch = $request->get('subtitlesSearch');
        $typeFilter = $request->get('typeFilter');
        $showings = Showing::with(['movie', 'hall']);

        if ($movieSearch) {
            $showings->whereHas('movie', function ($q) use ($movieSearch) {
                $q->where('title', 'ilike', "%$movieSearch%");
            });
        }
        if ($hallSearch) {
            $showings->whereHas('hall', function ($q) use ($hallSearch) {
                $q->where('number', 'ilike', $hallSearch);
            });
        }
        if ($speechSearch) {
            $showings->where('speech_lang', 'ilike', $speechSearch);
        }
        if ($dubbingSearch) {
            $showings->where('dubbing_lang', 'ilike', $dubbingSearch);
        }
        if ($subtitlesSearch) {
            $showings->where('subtitles_lang', 'ilike', $subtitlesSearch);
        }
        if ($typeFilter) {
            $showings->whereIn('type', $typeFilter);
        }

        if ($sortBy) {
            $showings->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        } else {
            $showings->orderBy('start_time', 'desc');
        }

        $rowCount = $showings->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $showings = $showings->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Showings/Index', [
            'showings' => $showings,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'movieSearch' => $movieSearch,
            'hallSearch' => $hallSearch,
            'speechSearch' => $speechSearch,
            'dubbingSearch' => $dubbingSearch,
            'subtitlesSearch' => $subtitlesSearch
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        Gate::authorize('create', Showing::class);
        $halls = Hall::all();
        $movies = Movie::orderBy('title')->get();
        return Inertia::render('Admin/Showings/Form', ['halls' => $halls, 'movies' => $movies]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ShowingRequest $request) {
        Gate::authorize('create', Showing::class);
        try {
            Showing::create($request->validated());
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać seansu'
            ]);
        }
        return redirect(route('showings.index'))->with([
            'message' => "Seans został dodany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Showing $showing) {
        Gate::authorize('create', Showing::class);
        $halls = Hall::all();
        $movies = Movie::all();
        return Inertia::render('Admin/Showings/Form', ['showing' => $showing, 'halls' => $halls, 'movies' => $movies]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ShowingRequest $request, Showing $showing) {
        Gate::authorize('update', $showing);
        try {
            $showing->update($request->validated());
        } catch (Exception $e) {

            return redirect()->back()->withErrors([
                'create' => 'Nie udało się zaktualizować wybranego seansu',
            ]);
        }
        return redirect(route('showings.index'))->with([
            'message' => "Seans został zaktualizowany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Showing $showing) {
        Gate::authorize('delete', $showing);
        try {
            $showing->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranego seansu'
            ]);
        }
    }
}
