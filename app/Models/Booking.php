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
 * @property int $showing_id
 * @property int|null $user_id
 * @property int $num_people
 * @property string $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Seat> $seats
 * @property-read int|null $seats_count
 * @property-read \App\Models\Showing $showing
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\BookingFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereNumPeople($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereShowingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereUserId($value)
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereLastName($value)
 * @mixin \Eloquent
 */
class Booking extends Model {
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;

    protected $fillable = [
        'showing_id', 'user_id', 'num_people', 'price', 'first_name', 'last_name', 'email', 'status'
    ];

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
