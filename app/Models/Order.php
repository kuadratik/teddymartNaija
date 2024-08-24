<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'clip_id',
        'first_name',
        'last_name',
        'email',
        'phone',
    ];

    /**
     * Get the clip that owns the order.
     */
    public function clip()
    {
        return $this->belongsTo(Clip::class);
    }
}
