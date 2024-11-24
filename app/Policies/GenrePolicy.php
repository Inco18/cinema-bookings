<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GenrePolicy {
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return $user->can(PermissionType::GENRE_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool {
        return $user->can(PermissionType::GENRE_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Genre $genre): bool {
        return $user->can(PermissionType::GENRE_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Genre $genre): bool {
        return $user->can(PermissionType::GENRE_MANAGE->value);
    }
}
