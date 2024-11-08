<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum HallType: string {
    use EnumToArray;

    case NORMAL = "normal";
    case THREE_D = "3D";
    case IMAX = "IMAX";
    case VIP = "VIP";
}
