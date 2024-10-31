<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $users = User::query();

        if ($search) {
            $users->whereAny(['first_name', 'last_name', 'email'], 'ilike', "%$search%");
        }

        if ($sortBy) {
            $users->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        }

        $rowCount = $users->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $users = $users->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'search' => $search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user) {
        $user->delete();
    }
}
