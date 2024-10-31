<?php

use App\Http\Controllers\Admin\MovieController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::resource('/movies', MovieController::class)->except(['show'])->middleware(['auth', 'admin']);
Route::resource('/users', UserController::class)->except(['show'])->middleware(['auth', 'admin']);


require __DIR__ . '/auth.php';
