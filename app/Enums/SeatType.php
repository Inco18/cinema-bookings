<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum SeatType: string {
    use EnumToArray;

    case NORMAL = "standard";
    case WIDE_TO_LEFT = "szerokie_do_lewej";
    case WIDE_TO_RIGHT = "szerokie_do_prawej";
    case DISABLED = "inwalidzi";
    case VIP = "vip";
}
