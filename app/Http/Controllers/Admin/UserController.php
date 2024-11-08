<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

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
        } else {
            $users->orderBy("id");
        }

        $rowCount = $users->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10)
            $page = ceil($rowCount / 10);
        if ($page < 1)
            $page = 1;

        $users = $users->with('roles')->paginate(10, ['*'], 'page', $page);

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
        $roles = Role::all()->pluck('name');
        return Inertia::render('Admin/Users/Form', ['roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request) {
        $user = User::create([...$request->except('roles'), 'password' => Hash::make("12345678")]);
        $user->syncRoles($request->input('roles'));
        return redirect(route('users.index'))->with([
            'message' => "Użytkownik został dodany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user) {
        $roles = Role::all()->pluck('name');
        return Inertia::render('Admin/Users/Form', ['user' => $user->load('roles'), 'roles' => $roles]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user) {
        $user->update(
            $request->except('roles')
        );
        $user->syncRoles($request->input('roles'));
        return redirect(route('users.index'))->with([
            'message' => "Użytkownik został zaktualizowany",
            'messageType' => 'success'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user) {
        $user->delete();
    }
}
