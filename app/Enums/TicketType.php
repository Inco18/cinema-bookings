<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum TicketType: string
{
    use EnumToArray;

    case NORMAL = 'normal';
    case REDUCED = 'reduced';
}
