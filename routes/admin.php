<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\GenreController;
use App\Http\Controllers\Admin\HallController;
use App\Http\Controllers\Admin\MovieController;
use App\Http\Controllers\Admin\PointsHistoryController;
use App\Http\Controllers\Admin\RewardController;
use App\Http\Controllers\Admin\SeatController;
use App\Http\Controllers\Admin\ShowingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserRewardController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::resource('/movies', MovieController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/genres', GenreController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/halls', HallController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/seats', SeatController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/showings', ShowingController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/bookings', BookingController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/users', UserController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/rewards', RewardController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/userRewards', UserRewardController::class)->except(['show'])->middleware(['auth', 'admin']);
    Route::resource('/pointsHistory', PointsHistoryController::class)->except(['show'])->middleware(['auth', 'admin']);
});

require __DIR__.'/auth.php';
