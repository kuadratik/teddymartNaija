<?php

namespace App\Rules;

use Closure;
use FFMpeg\FFMpeg;
use Illuminate\Contracts\Validation\ValidationRule;

class VideoDuration implements ValidationRule
{
    protected int $maxDuration;

    public function __construct(int $maxDuration = 65)
    {
        $this->maxDuration = $maxDuration;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (in_array($value->getClientOriginalExtension(), ['mp4', 'mov', 'avi'])) {
            $ffmpeg = FFMpeg::create();
            $video = $ffmpeg->open($value->getPathname());
            $format = $video->getFormat();
            $duration = $format->get('duration');

            if ($duration > $this->maxDuration) {
                $fail('The video must not be longer than ' . $this->maxDuration . ' seconds.');
            }
        }
    }
}
