<?php

use App\Http\Controllers\Admin\MovieController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/movies', [MovieController::class, 'index'])->middleware(['auth', 'admin'])->name('movies');


require __DIR__ . '/auth.php';
