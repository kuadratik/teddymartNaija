<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StorePromotePlanStore extends Model
{
    protected $table = 'store_promote_plan_store';
    protected $fillable = [
        'store_id',
        'store_promote_plan_id',
        'payment_id',
        'order_number',
        'status',
        'started_at',
        'expires_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public $primaryKey = 'store_id';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Define a many-to-many relationship with StorePromotePlan.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function promotePlans(): BelongsToMany
    {
        return $this->belongsToMany(StorePromotePlan::class, 'store_promote_plan_store', 'store_id', 'store_promote_plan_id')
            ->withPivot(['status', 'order_number', 'started_at', 'expires_at', 'created_at', 'updated_at']);
    }

    /**
     * Get the associated StorePromotePlan details.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function storePromotePlan(): BelongsTo
    {
        return $this->belongsTo(StorePromotePlan::class, 'store_promote_plan_id');
    }


    /**
     * store
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }
}
