<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RewardType;
use App\Enums\RewardValueType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RewardRequest;
use App\Models\Reward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Reward::class);
        $sortBy = $request->get('sortBy');
        $sortDesc = $request->get('sortDesc');
        $search = $request->get('search');
        $rewards = Reward::query();

        if ($search) {
            $rewards->where('name', 'ilike', "%$search%");
        }
        if ($sortBy) {
            $rewards->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
        }

        $rowCount = $rewards->count();
        $page = $request->get('page') ?? 1;
        if ($page > $rowCount / 10) {
            $page = ceil($rowCount / 10);
        }
        if ($page < 1) {
            $page = 1;
        }
        $rewards = $rewards->paginate(10, ['*'], 'page', $page);

        return Inertia::render('Admin/Rewards/Index', [
            'rewards' => $rewards,
            'rowCount' => $rowCount,
            'page' => $page,
            'sortBy' => $sortBy,
            'sortDesc' => $sortDesc,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Reward::class);
        $rewardTypes = RewardType::toArray();
        $rewardValueTypes = RewardValueType::toArray();

        return Inertia::render('Admin/Rewards/Form', [
            'rewardTypes' => $rewardTypes,
            'rewardValueTypes' => $rewardValueTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RewardRequest $request)
    {
        Gate::authorize('create', Reward::class);
        $path = '';
        if ($request->file('image')) {
            $path = $request->file('image')->store('rewards');
        }
        Reward::create([...$request->except(['image', 'removeImage']), 'image' => $path]);

        return redirect(route('rewards.index'))->with([
            'message' => 'Nagroda została dodana',
            'messageType' => 'success',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reward $reward)
    {
        Gate::authorize('update', $reward);
        $rewardTypes = RewardType::toArray();
        $rewardValueTypes = RewardValueType::toArray();

        return Inertia::render('Admin/Rewards/Form', [
            'reward' => $reward,
            'rewardTypes' => $rewardTypes,
            'rewardValueTypes' => $rewardValueTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RewardRequest $request, Reward $reward)
    {
        Gate::authorize('update', $reward);
        if ($reward->userRewards()->count() > 0) {
            return redirect(route('rewards.index'))->with([
                'error' => 'Nie można edytować nagrody, która została już przyznana użytkownikowi',
            ]);
        }
        $oldImage = $reward['image'];
        $newImage = $request->file('image');
        $removeImage = $request->input('removeImage');
        $path = $oldImage;

        if (($oldImage && $newImage) || ($oldImage && $removeImage)) {
            Storage::delete($oldImage);
            $path = '';
        }
        if ($newImage) {
            $path = $request->file('image')->store('rewards');
        }
        $reward->update([...$request->except(['image', 'removeImage']), 'image' => $path]);

        return redirect(route('rewards.index'))->with([
            'message' => 'Nagroda została zaktualizowana',
            'messageType' => 'success',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reward $reward)
    {
        Gate::authorize('delete', $reward);
        $rewardHasUsers = $reward->userRewards()->count() > 0;

        $oldImage = $reward['image'];
        if ($oldImage && ! $rewardHasUsers) {
            Storage::delete($oldImage);
        }
        $reward->delete();
    }
}
