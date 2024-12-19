<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceInteraction extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string, string>
     */
    protected $fillable = [
        'user_id',
        'listing_id',
    ];
   
    /**
     * Get the user for this service interaction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
   
   /**
     * Get the listing for this service interaction
     */
    public function listing(){
    
    }
}
