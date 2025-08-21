<?php

namespace App\Models;

use App\Enums\TicketType;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'ticket_type',
        'base_price',
        'min_price',
        'max_price',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'ticket_type' => 'string',
    ];
}
