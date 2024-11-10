<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Showing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

class ShowingsController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $showings = Showing::query();
        return Inertia::render('Main/Showings/Index', []);
    }


}
