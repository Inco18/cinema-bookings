<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRewardRequest;
use App\Models\Reward;
use App\Models\User;
use App\Models\UserReward;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserRewardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', UserReward::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $userSearch = $request->get('userSearch');
        $rewardSearch = $request->get('rewardSearch');
        $statusFilter = $request->get('statusFilter');
        $userRewards = UserReward::with(['reward', 'booking', 'user']);

        if ($userSearch) {
            $userRewards->whereHas('user', function ($q) use ($userSearch) {
                $q->whereAny(['first_name', 'last_name', 'email'], 'ilike', "%$userSearch%");
            });
        }
        if ($rewardSearch) {
            $userRewards->whereHas('reward', function ($q) use ($rewardSearch) {
                $q->where('name', 'ilike', "%$rewardSearch%");
            });
        }

        if ($statusFilter) {
            $userRewards->whereIn('status', $statusFilter);
        }

        if ($sortBy) {
            $userRewards->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        } else {
            $userRewards->orderBy('created_at', 'desc');
        }

        $rowCount = $userRewards->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10) {
            $page = ceil($rowCount / 10);
        }
        if ($page < 1) {
            $page = 1;
        }

        $userRewards = $userRewards->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/UserRewards/Index', [
            'userRewards' => $userRewards,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'rewardSearch' => $rewardSearch,
            'userSearch' => $userSearch,
            'statusFilter' => $statusFilter,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', UserReward::class);
        $users = User::orderBy('first_name')->orderBy('last_name')->get();
        $rewards = Reward::orderBy('name')->orderBy('value')->get();

        return Inertia::render('Admin/UserRewards/Form', ['users' => $users, 'rewards' => $rewards]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRewardRequest $request)
    {
        Gate::authorize('create', UserReward::class);
        try {
            UserReward::create($request->validated());
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'create' => 'Nie udało się dodać nagrody dla użytkownika',
            ]);
        }

        return redirect(route('userRewards.index'))->with([
            'success' => 'Nagroda dla użytkownika została dodana',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserReward $userReward)
    {
        Gate::authorize('update', $userReward);
        $users = User::orderBy('first_name')->orderBy('last_name')->get();
        $rewards = Reward::orderBy('name')->orderBy('value')->get();

        return Inertia::render('Admin/UserRewards/Form', ['userReward' => $userReward, 'users' => $users, 'rewards' => $rewards]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRewardRequest $request, UserReward $userReward)
    {
        Gate::authorize('update', $userReward);
        try {
            $userReward->update($request->validated());
        } catch (Exception $e) {

            return redirect()->back()->withErrors([
                'create' => 'Nie udało się zaktualizować wybranego nagrody dla użytkownika',
            ]);
        }

        return redirect(route('userRewards.index'))->with([
            'success' => 'Nagroda dla użytkownika została zaktualizowana',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserReward $userReward)
    {
        Gate::authorize('delete', $userReward);
        try {
            $userReward->delete();
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Nie udało się usunąć wybranej nagrody użytkownika',
            ]);
        }

        return back()->with([
            'success' => 'Nagroda użytkownika została usunięta',
        ]);
    }
}
