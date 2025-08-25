<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoyaltyProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $points = $request->user()->pointsHistory()->latest()->get();

        return Inertia::render('Main/LoyaltyProgram/Index', ['points' => $points]);
    }
}
