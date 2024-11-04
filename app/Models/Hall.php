<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hall extends Model {
    /** @use HasFactory<\Database\Factories\HallFactory> */
    use HasFactory;

    public function seats(): HasMany {
        return $this->hasMany(Seat::class);
    }
    public function showings(): HasMany {
        return $this->hasMany(Showing::class);
    }
}
