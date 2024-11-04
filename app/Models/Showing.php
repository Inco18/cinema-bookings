<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Showing extends Model {
    /** @use HasFactory<\Database\Factories\ShowingFactory> */
    use HasFactory;

    public function hall(): BelongsTo {
        return $this->belongsTo(Hall::class);
    }
    public function movie(): BelongsTo {
        return $this->belongsTo(Movie::class);
    }
    public function bookings(): HasMany {
        return $this->hasMany(Booking::class);
    }
}
