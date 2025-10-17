<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\User;
use App\Models\PointsHistory;

class PointsHistoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionType::POINTS_HISTORY_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionType::POINTS_HISTORY_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PointsHistory $pointsHistory): bool
    {
        return $user->can(PermissionType::POINTS_HISTORY_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PointsHistory $pointsHistory): bool
    {
        return $user->can(PermissionType::POINTS_HISTORY_MANAGE->value);
    }
}
