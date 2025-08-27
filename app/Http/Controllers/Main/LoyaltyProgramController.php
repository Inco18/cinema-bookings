<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Reward;
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
        $rewards = Reward::query()->orderBy('cost_points')->get();

        return Inertia::render('Main/LoyaltyProgram/Index', ['points' => $points, 'rewards' => $rewards]);
    }
}
