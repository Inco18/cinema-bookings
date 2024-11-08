<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum SeatType: string {
    use EnumToArray;

    case NORMAL = "normal";
    case WIDE = "wide";
    case DISABLED = "disabled";
    case VIP = "vip";
}
