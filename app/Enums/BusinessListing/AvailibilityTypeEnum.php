<?php

namespace App\Enums\BusinessListing;

enum AvailibilityTypeEnum: string
{
    case FLEX = 'flex';
    case FRAME = 'frame';

    public function requiresDayOfMonth(): bool
    {
        return $this === self::FLEX;
    }

    public function validationRules(): array
    {
        return match ($this) {
            self::FLEX => ['required', 'numeric', 'min:1', 'max:31'],
            self::FRAME => ['required', 'string', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday']
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
