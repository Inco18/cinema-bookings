<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Booking extends Model {
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;

    public function showing(): BelongsTo {
        return $this->belongsTo(Showing::class);
    }
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function seats(): BelongsToMany {
        return $this->belongsToMany(Seat::class);
    }
}
