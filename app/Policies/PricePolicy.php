<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\User;
use App\Models\Price;

class PricePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionType::PRICE_ACCESS->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Price $price): bool
    {
        return $user->can(PermissionType::PRICE_MANAGE->value);
    }
}
