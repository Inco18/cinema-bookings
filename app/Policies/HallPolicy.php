<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\Hall;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class HallPolicy {
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return $user->can(PermissionType::HALL_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool {
        return $user->can(PermissionType::HALL_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Hall $hall): bool {
        return $user->can(PermissionType::HALL_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Hall $hall): bool {
        return $user->can(PermissionType::HALL_MANAGE->value);
    }
}
