<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy {
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return $user->can(PermissionType::USER_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool {
        return $user->can(PermissionType::USER_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool {
        return $user->can(PermissionType::USER_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool {
        return $user->can(PermissionType::USER_MANAGE->value);
    }
}
