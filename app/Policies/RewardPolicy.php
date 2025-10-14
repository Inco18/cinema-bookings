<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\Reward;
use App\Models\User;

class RewardPolicy {
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return $user->can(PermissionType::REWARD_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool {
        return $user->can(PermissionType::REWARD_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Reward $reward): bool {
        return $user->can(PermissionType::REWARD_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Reward $reward): bool {
        return $user->can(PermissionType::REWARD_MANAGE->value);
    }
}
