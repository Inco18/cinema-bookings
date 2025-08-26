<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reward extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'cost_points',
        'type',
        'value',
        'value_type',
        'details',
        'image',
    ];

    public function userRewards()
    {
        return $this->hasMany(UserReward::class);
    }
}
