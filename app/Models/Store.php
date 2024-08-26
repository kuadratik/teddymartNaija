<?php

namespace App\Models;

use App\Actions\FetchUserMostInteractedCategoriesAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Store extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array<string, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'contact_number',
        'whatsapp_number',
        'profile_picture_path',
        'banner_path',
        'description',
        'address1',
        'address2',
        'state',
        'city',
        'postal_code',
        'country_id'
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * The booted method of the model.
     */
    protected static function booted()
    {
        static::saving(function (Store $model) {
            $model->slug = str($model->name)->slug();
        });
    }

    /**
     * Get the store owner
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get the store owner
     */
    public function scopebyUser(Builder $query, $userId)
    {
        $query->where('user_id', $userId);
    }

    /**
     * Scope by listing type
     */
    public function scopeByListingType(Builder $query, $listingType)
    {
        $query->whereHas('listings', fn ($query) => $query->where('type', $listingType));
    }

    /**
     * Scope by search
     */
    public function scopeSearch(Builder $query, $search)
    {
        $query->whereLike('name', "%$search%")->orWhereHas(
            'listings',
            fn ($query) => $query->whereLike('name', "%$search%")
        );
    }

    /**
     * Scope by category
     */
    public function scopeByCategory(Builder $query, $category)
    {
        $query->whereHas('listings', fn ($query) => $query->where('category_id', $category));
    }

    /**
     * Scope by recommended
     */
    public function scopeRecommended(Builder $query)
    {
        $mostUsedCategories = app(FetchUserMostInteractedCategoriesAction::class)->fetch();
        $query->whereHas(
            'listings',
            fn ($query) => $query->whereIntegerInRaw('category_id', $mostUsedCategories)
                ->orderByRaw("FIELD(category_id, " . implode(',', $mostUsedCategories) . ") DESC")
        );
    }
}
