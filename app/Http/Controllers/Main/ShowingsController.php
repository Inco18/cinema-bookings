<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use App\Models\Showing;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShowingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (Auth::user()?->hasRole('admin')) {
            abort(403);
        }
        $day = $request->input('day') ?? Carbon::now()->toDateString();
        $subtitles_lang = $request->input('subtitles_lang');
        $speech_lang = $request->input('speech_lang');
        $dubbing_lang = $request->input('dubbing_lang');
        $genre_id = $request->input('genre_id');
        $genres = Genre::orderBy('name', 'asc')->get();

        $showingsQuery = Showing::with(['movie', 'hall'])->whereDate('start_time', $day);

        if ($genre_id) {
            $showingsQuery = $showingsQuery->whereHas('movie', function ($q) use ($genre_id) {
                $q->where('genre_id', '=', $genre_id);
            });
        }
        if ($subtitles_lang) {
            $showingsQuery = $showingsQuery->where('subtitles_lang', '=', $subtitles_lang);
        }
        if ($speech_lang) {
            $showingsQuery = $showingsQuery->where('speech_lang', '=', $speech_lang);
        }
        if ($dubbing_lang) {
            $showingsQuery = $showingsQuery->where('dubbing_lang', '=', $dubbing_lang);
        }

        $user = auth()->user();
        $recommendedMovieIds = collect();
        if ($user) {
            $favoriteGenres = $user->bookings()
                ->with('showing.movie.genre')
                ->get()
                ->pluck('showing.movie.genre_id')
                ->filter()
                ->countBy()
                ->sortDesc()
                ->keys()
                ->take(3);

            if ($favoriteGenres->isNotEmpty()) {
                $recommendedMovieIds = Showing::with('movie')
                    ->whereDate('start_time', $day)
                    ->whereHas('movie', function ($q) use ($favoriteGenres) {
                        $q->whereIn('genre_id', $favoriteGenres);
                    })
                    ->pluck('movie_id')
                    ->unique();
            }
        }

        $showings = $showingsQuery->orderBy('movie_id')->orderBy('start_time')->get()->groupBy('movie_id');

        $orderedShowingsArr = [];
        foreach ($recommendedMovieIds as $movieId) {
            if ($showings->has($movieId)) {
                $orderedShowingsArr[] = $showings[$movieId]->values();
            }
        }
        foreach ($showings as $movieId => $seances) {
            if (! in_array($movieId, $recommendedMovieIds->all())) {
                $orderedShowingsArr[] = $seances->values();
            }
        }

        return Inertia::render('Main/Showings/Index', [
            'day' => $day,
            'genres' => $genres,
            'subtitles_lang' => $subtitles_lang,
            'speech_lang' => $speech_lang,
            'dubbing_lang' => $dubbing_lang,
            'genre_id' => $genre_id,
            'showings' => $orderedShowingsArr,
        ]);
    }
}
