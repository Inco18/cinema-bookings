<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum UserRewardStatus: string {
    use EnumToArray;

    case ACTIVE = 'active';
    case USED = 'used';
}
