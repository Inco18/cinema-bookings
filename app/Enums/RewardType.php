<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum RewardType: string {
    use EnumToArray;

    case DISCOUNT = 'discount';
    case FREE_ITEM = 'free_item';
    case MERCH = 'merch';
}
