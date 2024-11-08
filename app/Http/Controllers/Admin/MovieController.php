<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MovieRequest;
use App\Models\Genre;
use App\Models\Movie;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MovieController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response {
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $movies = Movie::with('genre');

        if ($search) {
            $movies->whereAny(['title', 'director'], 'ilike', "%$search%");
        }

        if ($sortBy) {
            $movies->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        }

        $rowCount = $movies->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $movies = $movies->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Movies/Index', [
            'movies' => $movies,
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
        $genres = Genre::all();
        return Inertia::render('Admin/Movies/Form', ['genres' => $genres]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MovieRequest $request) {
        $path = "";
        if ($request->file('poster_image')) {
            $path = $request->file('poster_image')->store('posters');
        }
        Movie::create([...$request->except(['poster_image', 'removePoster']), 'poster_image' => $path]);

        return redirect(route('movies.index'))->with([
            'message' => "Film został dodany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Movie $movie) {
        $genres = Genre::all();
        return Inertia::render('Admin/Movies/Form', ['movie' => $movie, 'genres' => $genres]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MovieRequest $request, Movie $movie) {
        $oldPoster = $movie['poster_image'];
        $newPoster = $request->file('poster_image');
        $removePoster = $request->input('removePoster');
        $path = $oldPoster;

        if (($oldPoster && $newPoster) || ($oldPoster && $removePoster)) {
            Storage::delete($oldPoster);
            $path = "";
        }

        if ($newPoster) {
            $path = $request->file('poster_image')->store('posters');
        }

        $movie->update(
            [...$request->except(['poster_image', 'removePoster']), 'poster_image' => $path]
        );
        return redirect(route('movies.index'))->with([
            'message' => "Film został zaktualizowany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Movie $movie) {
        $oldPoster = $movie['poster_image'];
        if ($oldPoster) {
            Storage::delete($oldPoster);
        }
        $movie->delete();
    }
}
