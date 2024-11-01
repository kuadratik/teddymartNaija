<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'business_name',
        'business_slug',
        'business_description',
        'business_email',
        'business_address',
        'business_contact_number',
        'business_logo_url',
        'category_id',
        'show_business_description',
        'show_business_email',
        'show_business_address',
        'indetifier'
    ];

    /**
     * The booted method of the model.
     */
    protected static function booted()
    {
        static::saving(function (Advertisement $model) {
            $model->business_slug = str($model->business_name)->slug();
        });
    }
}
