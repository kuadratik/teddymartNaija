<?php

namespace App\Traits;

use App\Enums\DurationTypeEnum;

trait HandlesDuration
{
    public function calculateHours(int $duration_number, DurationTypeEnum $duration_type): int
    {
        return match ($duration_type) {
            DurationTypeEnum::HOUR => $duration_number,
            DurationTypeEnum::DAY => $duration_number * 24,
            DurationTypeEnum::WEEK => $duration_number * 24 * 7,
            DurationTypeEnum::MONTH => $duration_number * 24 * 30,
            DurationTypeEnum::YEAR => $duration_number * 24 * 365,
            DurationTypeEnum::MINUTE => $duration_number / 60,
            DurationTypeEnum::SECOND => $duration_number / 3600,
            default => 24
        };
    }
}
