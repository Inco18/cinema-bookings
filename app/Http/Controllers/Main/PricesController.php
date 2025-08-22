<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Http\Resources\MainPricesResource;
use App\Models\Price;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $prices = Price::all();

        return Inertia::render('Main/Prices/Index', ['prices' => MainPricesResource::collection($prices)->resolve(), 'validFrom' => $prices->max('updated_at')->format('d.m.Y')]);
    }
}
