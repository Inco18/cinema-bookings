<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum BookingStatus: string {
    use EnumToArray;

    case RESERVED = "zarezerwowany";
    case FILLED = "wypełniony";
    case PAID = "opłacony";
}
