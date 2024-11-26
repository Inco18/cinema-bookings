<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Showing;
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
    public function show(Showing $showing) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Showing $showing) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Showing $showing) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Showing $showing) {
        //
    }
}
