<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\Showing;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ShowingPolicy {
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return $user->can(PermissionType::SHOWING_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool {
        return $user->can(PermissionType::SHOWING_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Showing $showing): bool {
        return $user->can(PermissionType::SHOWING_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Showing $showing): bool {
        return $user->can(PermissionType::SHOWING_MANAGE->value);
    }
}
