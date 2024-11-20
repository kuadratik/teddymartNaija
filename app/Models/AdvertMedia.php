<?php

namespace App\Models;

use App\Enums\AdvertMediaType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertMedia extends Model
{

    use HasFactory;

    protected $fillable = [
        'advert_listing_id',
        'file_path',
        'type',
    ];

    protected $cast = [
        'type' => AdvertMediaType::class,
    ];


    /**
     * Get the advert listing associated with the AdvertMedia.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function advertListing()
    {
        return $this->belongsTo(AdvertListing::class);
    }
}
