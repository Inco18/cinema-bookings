<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class GenreController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        Gate::authorize('viewAny', Genre::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $genres = Genre::query();

        if ($search) {
            $genres->where('name', 'ilike', "%$search%");
        }

        if ($sortBy) {
            $genres->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        }

        $rowCount = $genres->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $genres = $genres->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Genres/Index', [
            'genres' => $genres,
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
        Gate::authorize('create', Genre::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        Gate::authorize('create', Genre::class);
    }

    /**
     * Display the specified resource.
     */
    public function show(Genre $genre) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Genre $genre) {
        Gate::authorize('update', $genre);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Genre $genre) {
        Gate::authorize('update', $genre);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genre $genre) {
        Gate::authorize('delete', $genre);
    }
}
