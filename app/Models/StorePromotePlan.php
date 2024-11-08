<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorePromotePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'duration_days',
    ];

    /**
     * The stores associated with this promotion plan.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function stores()
    {
        return $this->belongsToMany(Store::class, 'store_promote_plan_store')
            ->using(StorePromotePlanStore::class) // Custom pivot model
            ->withPivot(['payment_id', 'status', 'started_at', 'expires_at'])
            ->withTimestamps();
    }
}
