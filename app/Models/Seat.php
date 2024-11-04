<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Seat extends Model {
    /** @use HasFactory<\Database\Factories\SeatFactory> */
    use HasFactory;

    public function hall(): BelongsTo {
        return $this->belongsTo(Hall::class);
    }
    public function bookings(): BelongsToMany {
        return $this->belongsToMany(Booking::class);
    }
}
