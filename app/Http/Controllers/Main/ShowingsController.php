<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use App\Models\Showing;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class ShowingsController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $day = $request->input('day') ?? Carbon::now()->toDateString();
        $subtitles_lang = $request->input('subtitles_lang');
        $speech_lang = $request->input('speech_lang');
        $dubbing_lang = $request->input('dubbing_lang');
        $genre_id = $request->input("genre_id");
        $genres = Genre::orderBy('name', 'asc')->get();
        $showings = Showing::with(['movie', 'hall'])->whereDate('start_time', $day);

        if ($genre_id)
            $showings = $showings->whereHas('movie', function ($q) use ($genre_id) {
                $q->where('genre_id', '=', $genre_id);
            });
        if ($subtitles_lang)
            $showings = $showings->where('subtitles_lang', '=', $subtitles_lang);
        if ($speech_lang)
            $showings = $showings->where('speech_lang', '=', $speech_lang);
        if ($dubbing_lang)
            $showings = $showings->where('dubbing_lang', '=', $dubbing_lang);

        $showings = $showings->orderBy('movie_id')->orderBy('start_time')->get()->groupBy("movie_id");

        return Inertia::render('Main/Showings/Index', ['day' => $day, 'genres' => $genres, 'subtitles_lang' => $subtitles_lang, 'speech_lang' => $speech_lang, 'dubbing_lang' => $dubbing_lang, 'genre_id' => $genre_id, 'showings' => $showings]);
    }


}
