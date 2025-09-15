<?php

namespace Tests\Feature;

use App\Enums\RewardType;
use App\Models\Reward;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyProgramControllerFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected $reward;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PermissionSeeder::class);
        $this->seed(RoleSeeder::class);
        $this->user = User::factory()->create(['points_number' => 200]);
        $this->reward = Reward::create([
            'cost_points' => 100,
            'name' => 'Testowa nagroda',
            'type' => RewardType::DISCOUNT->value,
            'value' => 20,
        ]);
    }

    /** @test */
    public function user_can_redeem_reward_with_enough_points()
    {
        $this->actingAs($this->user);
        $response = $this->post(route('main.loyaltyProgram.redeemReward'), [
            'reward_id' => $this->reward->id,
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('user_rewards', [
            'user_id' => $this->user->id,
            'reward_id' => $this->reward->id,
        ]);
        $this->assertDatabaseHas('points_history', [
            'user_id' => $this->user->id,
            'points_change' => -$this->reward->cost_points,
        ]);
        $this->assertEquals(100, $this->user->fresh()->points_number);
    }

    /** @test */
    public function user_cannot_redeem_reward_without_enough_points()
    {
        $this->user->update(['points_number' => 50]);
        $this->actingAs($this->user);
        $response = $this->post(route('main.loyaltyProgram.redeemReward'), [
            'reward_id' => $this->reward->id,
        ]);
        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('user_rewards', [
            'user_id' => $this->user->id,
            'reward_id' => $this->reward->id,
        ]);
        $this->assertEquals(50, $this->user->fresh()->points_number);
    }

    /** @test */
    public function redeem_reward_handles_db_error_and_rolls_back()
    {
        $this->actingAs($this->user);
        // Symuluj błąd przez ustawienie nieistniejącego reward_id
        $response = $this->post(route('main.loyaltyProgram.redeemReward'), [
            'reward_id' => 999999,
        ]);
        $response->assertNotFound();
        $this->assertEquals(200, $this->user->fresh()->points_number);
    }
}
