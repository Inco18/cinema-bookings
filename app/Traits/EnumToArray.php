<?php

namespace App\Traits;

trait EnumToArray {
    /**
     * Convert an enum class to an array of its values
     *
     * @return array
     */
    public static function toArray(): array {
        return array_column(self::cases(), 'value');
    }
}
