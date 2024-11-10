<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ShowingType: string {
    use EnumToArray;

    case TWO_D = "2d";
    case THREE_D = "3d";
}
