<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    use HasTimestamps;

    protected $fillable = [
        'code',
        'percent',
        'max_uses',
        'uses',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function isValid(): bool
    {
        return $this->expires_at >= now() && $this->uses < $this->max_uses;
    }
}
