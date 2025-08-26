<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum RewardValueType: string {
    use EnumToArray;

    case PERCENT = 'percent';
    case AMOUNT = 'amount';
    case ITEM = 'item';
}
