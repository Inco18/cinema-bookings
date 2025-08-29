<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Model;

class PointsHistory extends Model
{
    use HasTimestamps;

    protected $table = 'points_history';

    protected $fillable = [
        'user_id',
        'booking_id',
        'user_reward_id',
        'points_change',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function userReward()
    {
        return $this->belongsTo(UserReward::class);
    }
}
