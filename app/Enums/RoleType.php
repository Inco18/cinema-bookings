<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum RoleType: string {
    use EnumToArray;

    case ADMIN = 'admin';
    case WORKER = 'worker';
    case CLIENT = 'client';
}
