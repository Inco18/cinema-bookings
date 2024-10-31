<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMovieRequest;
use App\Http\Requests\UpdateMovieRequest;
use App\Models\Movie;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MovieController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response {
        $page = $request->get('page') ?? 1;
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $movies = Movie::query();

        if ($search) {
            $movies->whereAny(['title', 'director'], 'ilike', "%$search%");
        }

        if ($sortBy) {
            $movies->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        }

        $rowCount = $movies->count();

        $movies = $movies->paginate(10);

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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovieRequest $request) {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Movie $movie) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Movie $movie) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovieRequest $request, Movie $movie) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Movie $movie) {
        //
    }
}
