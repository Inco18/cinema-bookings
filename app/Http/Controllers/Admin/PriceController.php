<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PriceRequest;
use App\Models\Price;
use Exception;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PriceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Price::class);
        $prices = Price::orderBy('ticket_type')->get();

        return Inertia::render('Admin/Prices/Index', [
            'prices' => $prices,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PriceRequest $request, Price $price)
    {
        Gate::authorize('update', $price);
        try {
            $price->update($request->validated());
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'update' => 'Nie udało się zaktualizować ceny',
            ]);
        }

        return redirect(route('prices.index'))->with([
            'success' => 'Cena została zaktualizowana',
        ]);
    }
}
