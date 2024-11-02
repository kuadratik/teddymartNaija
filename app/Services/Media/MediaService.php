<?php

namespace App\Services\Media;

use App\Models\AdvertMedia;
use App\Enums\AdvertMediaType;
use Illuminate\Support\Str;

class MediaService
{
    /**
     * Store media records for the given paths
     */
    public function storeMedia(int $advertListingId, array $media): array
    {
        $mediaRecords = [];

        foreach ($media as $mediaItem) {
            $mediaRecords[] = $this->createMediaRecord(
                $advertListingId,
                $mediaItem,
                $this->determineMediaType($mediaItem)
            );
        }

        return $mediaRecords;
    }

    /**
     * Create media record in database
     */
    private function createMediaRecord(
        int $advertListingId,
        string $path,
        AdvertMediaType $type
    ): AdvertMedia {
        return AdvertMedia::create([
            'advert_listing_id' => $advertListingId,
            'file_path' => $path,
            'type' => $type->value
        ]);
    }

    /**
     * Determine media type from mime type or file extension
     */
    private function determineMediaType(string $type): AdvertMediaType
    {
        return match (true) {
            Str::contains($type, ['video', 'mp4', 'mov', 'webm', 'avi']) => AdvertMediaType::VIDEO,
            default => AdvertMediaType::IMAGE
        };
    }

    /**
     * Delete media records
     */
    public function deleteMedia(array $mediaIds): void
    {
        AdvertMedia::whereIn('id', $mediaIds)->delete();
    }
}
