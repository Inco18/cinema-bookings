<?php

namespace App\Enums;

use App\Traits\EnumToArray;


enum PermissionType: string {
    use EnumToArray;

    case USER_ACCESS = 'user_access';
    case USER_MANAGE = 'user_manage';

    case GENRE_ACCESS = 'genre_access';
    case GENRE_MANAGE = 'genre_manage';

    case MOVIE_ACCESS = 'movie_access';
    case MOVIE_MANAGE = 'movie_manage';

    case HALL_ACCESS = 'hall_access';
    case HALL_MANAGE = 'hall_manage';

    case SEAT_ACCESS = 'seat_access';
    case SEAT_MANAGE = 'seat_manage';

    case SHOWING_ACCESS = 'showing_access';
    case SHOWING_MANAGE = 'showing_manage';

    case BOOKING_ACCESS = 'booking_access';
    case BOOKING_MANAGE = 'booking_manage';

    case REWARD_ACCESS = 'reward_access';
    case REWARD_MANAGE = 'reward_manage';
    case USER_REWARD_ACCESS = 'user_reward_access';
    case USER_REWARD_MANAGE = 'user_reward_manage';
    case POINTS_HISTORY_ACCESS = 'points_history_access';
    case POINTS_HISTORY_MANAGE = 'points_history_manage';

}
