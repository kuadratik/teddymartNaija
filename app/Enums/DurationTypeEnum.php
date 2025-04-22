<?php

namespace App\Enums;

enum DurationTypeEnum: string
{
    case HOUR = 'hour';
    case DAY = 'day';
    case WEEK = 'week';
    case SECOND = 'second';
    case MONTH = 'month';
    case YEAR = 'year';
    case MINUTE = 'minute';
}
