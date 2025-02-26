<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 *
 *
 * @property int $id
 * @property int $hall_id
 * @property string $type
 * @property int $row
 * @property int $column
 * @property int $number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read \App\Models\Hall $hall
 * @method static \Database\Factories\SeatFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereHallId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereRow($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Seat whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Seat extends Model {
    /** @use HasFactory<\Database\Factories\SeatFactory> */
    use HasFactory;

    protected $fillable = [
        'hall_id',
        'type',
        'row',
        'column',
        'number'
    ];

    public function hall(): BelongsTo {
        return $this->belongsTo(Hall::class);
    }
    public function bookings(): BelongsToMany {
        return $this->belongsToMany(Booking::class);
    }
}
