<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        Gate::authorize('viewAny', User::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $rolesFilter = $request->get('roles');
        $users = User::with('roles');

        if ($search) {
            $users->whereAny(['first_name', 'last_name', 'email'], 'ilike', "%$search%");
        }

        if ($rolesFilter) {
            $users->whereHas('roles', function ($role) use ($rolesFilter) {
                $role->whereIn('name', $rolesFilter);
            });
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

        $users = $users->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'search' => $search,
            'rolesFilter' => $rolesFilter
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        Gate::authorize('create', User::class);
        $roles = Role::all()->pluck('name');
        return Inertia::render('Admin/Users/Form', ['roles' => $roles]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request) {
        Gate::authorize('create', User::class);
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
        Gate::authorize('update', $user);
        $roles = Role::all()->pluck('name');
        return Inertia::render('Admin/Users/Form', ['user' => $user->load('roles'), 'roles' => $roles]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user) {
        Gate::authorize('update', $user);
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
        Gate::authorize('delete', $user);
        $user->delete();
    }
}
