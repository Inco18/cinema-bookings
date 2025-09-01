<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoyaltyProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $points = $request->user()->pointsHistory()->latest()->get();
        $rewards = Reward::query()->orderBy('cost_points')->get();
        $redeemedRewards = $request->user()->userRewards()->with('reward')->orderBy('status')->latest()->get();

        return Inertia::render('Main/LoyaltyProgram/Index', ['points' => $points, 'rewards' => $rewards, 'redeemedRewards' => $redeemedRewards]);
    }

    public function redeemReward(Request $request)
    {
        $reward = Reward::findOrFail($request->input('reward_id'));
        $user = $request->user();

        if ($user->points_number < $reward->cost_points) {
            return redirect()->back()->with('error', 'Nie masz wystarczającej liczby punktów, aby odebrać tę nagrodę.');
        }


        try {
            DB::beginTransaction();

            $user->points_number -= $reward->cost_points;
            $user->save();

            $userReward = $user->userRewards()->create([
                'reward_id' => $reward->id,
                'status' => 'active',
            ]);

            $user->pointsHistory()->create([
                'points_change' => -$reward->cost_points,
                'description' => 'Odebrano nagrodę: '.$reward->name,
                'user_reward_id' => $userReward->id,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            Log::error('Error redeeming reward: '.$e->getMessage());
            DB::rollBack();

            return redirect()->back()->with('error', 'Wystąpił błąd podczas odbierania nagrody.');
        }

        return redirect()->back()->with('success', 'Pomyślnie odebrano nagrodę: '.$reward->name);
    }
}
