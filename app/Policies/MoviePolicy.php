<?php

namespace App\Policies;

use App\Enums\PermissionType;
use App\Models\Movie;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MoviePolicy {
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool {
        return $user->can(PermissionType::MOVIE_ACCESS->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool {
        return $user->can(PermissionType::MOVIE_MANAGE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Movie $movie): bool {
        return $user->can(PermissionType::MOVIE_MANAGE->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Movie $movie): bool {
        return $user->can(PermissionType::MOVIE_MANAGE->value);
    }
}
