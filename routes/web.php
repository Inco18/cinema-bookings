<?php

use App\Http\Controllers\Main\BookingController;
use App\Http\Controllers\Main\ShowingsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect(route('main.showings.index'));
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
})->name("index");

Route::get('/showings', [ShowingsController::class, 'index'])->name('main.showings.index');
Route::resource('/bookings', BookingController::class)->names('main.bookings');
Route::get('/bookings/{booking}/confirmation', [BookingController::class, 'showConfirmation'])->name('main.bookings.confirmation');
Route::get('/bookings/{booking}/tickets', [BookingController::class, 'downloadTickets'])->name('main.bookings.tickets');

Route::get('/admin', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
