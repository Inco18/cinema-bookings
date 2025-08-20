<?php

use App\Http\Controllers\Main\BookingController;
use App\Http\Controllers\Main\ShowingsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect(route('main.showings.index'));
})->name('index');

Route::get('/showings', [ShowingsController::class, 'index'])->name('main.showings.index');
Route::resource('/bookings', BookingController::class)->names('main.bookings');
Route::get('/bookings/{booking}/chooseTickets', [BookingController::class, 'showChooseTickets'])->name('main.bookings.chooseTickets');
Route::patch('/bookings/{booking}/updateTickets', [BookingController::class, 'updateTickets'])->name('main.bookings.updateTickets');
Route::get('/bookings/{booking}/confirmation', [BookingController::class, 'showConfirmation'])->name('main.bookings.confirmation');
Route::get('/bookings/{booking}/tickets', [BookingController::class, 'downloadTickets'])->name('main.bookings.tickets');
Route::get('/bookings/{booking}/edit_seats', [BookingController::class, 'editSeats'])->name('main.bookings.edit_seats');
Route::patch('/bookings/{booking}/update_seats', [BookingController::class, 'updateSeats'])->name('main.bookings.update_seats');
Route::get('/bookings/{booking}/handle_payment_response', [BookingController::class, 'handlePaymentResponse'])->name('main.bookings.handle_payment_response');
Route::get('/bookings/{booking}/retry_payment', [BookingController::class, 'retryPayment'])->name('main.bookings.retry_payment');

Route::get('/admin', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
