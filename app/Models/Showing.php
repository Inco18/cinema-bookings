<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 *
 *
 * @property int $id
 * @property int $movie_id
 * @property int $hall_id
 * @property string $start_time
 * @property string $end_time
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read \App\Models\Hall $hall
 * @property-read \App\Models\Movie $movie
 * @method static \Database\Factories\ShowingFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereHallId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereMovieId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Showing whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Showing extends Model {
    /** @use HasFactory<\Database\Factories\ShowingFactory> */
    use HasFactory;

    protected $fillable = [
        'hall_id',
        'movie_id',
        'start_time',
        'end_time',
        'speech_lang',
        'dubbing_lang',
        'subtitles_lang',
        'type'
    ];

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
