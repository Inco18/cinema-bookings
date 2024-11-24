<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GenreRequest;
use App\Models\Genre;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Session;

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
        } else {
            $genres->orderBy('id', 'asc');
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

        return Inertia::render('Admin/Genres/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GenreRequest $request) {
        Gate::authorize('create', Genre::class);
        try {
            Genre::create(['name' => $request->input('name')]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać gatunku'
            ]);
        }
        return redirect(route('genres.index'))->with([
            'message' => "Gatunek został dodany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Genre $genre) {
        Gate::authorize('update', $genre);
        return Inertia::render('Admin/Genres/Form', ['genre' => $genre]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GenreRequest $request, Genre $genre) {
        Gate::authorize('update', $genre);
        try {
            $genre->update(
                ['name' => $request->input('name')]
            );
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'update' => 'Nie udało się zaktualizować wybranego gatunku'
            ]);
        }
        return redirect(route('genres.index'))->with([
            'message' => "Gatunek został zaktualizowany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genre $genre) {
        Gate::authorize('delete', $genre);
        try {
            $genre->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranego gatunku'
            ]);
        }
    }
}
