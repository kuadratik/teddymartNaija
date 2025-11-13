<?php

namespace App\Models;

use App\Actions\FetchPopularRecommenationAction;
use App\Actions\FetchUserMostInteractedCategoriesAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'id',
        'user_id',
        'name',
        'slug',
        'type',
        'payment_status',
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
        'country_id',
        'views_count',
        'currency',
        'active',
        'step',
        'order_number',
        'fee_amount'
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['user:id,offers_product,offers_service'];

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

    /**
     * Get the store listings
     */
    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get the store categories
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'store_categories');
    }

    /**
     * get store products listing
     */
    public function products()
    {
        return $this->listings()->where('type', 'product');
    }

    /**
     * get store services listing
     */
    public function services()
    {
        return $this->listings()->where('type', 'service');
    }

    /**
     * Shipping Method for each store
     */
    public function shippingMethods()
    {
        return $this->hasMany(StoreShippingMethod::class, 'store_id');
    }


    /**
     * Get the store orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'store_id');
    }

    /**
     * Get the store ratings
     */
    public function ratings()
    {
        return $this->hasMany(ListingRating::class);
    }

    /**
     * Get the country that owns the Store
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    /**
     * The promotion plans associated with the store.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function promotedStores()
    {
        return $this->belongsTo(StorePromotePlanStore::class, 'id', 'store_id');
    }


    /**
     * store payout details
     */
    public function payoutDetails(): HasMany
    {
        return $this->hasMany(StorePayoutDetail::class, 'store_id');
    }


    /**
     * Get the default payout detail for the store.
     */
    public function defaultPayoutDetail()
    {
        return $this->hasOne(StorePayoutDetail::class, 'store_id')
            ->where('is_default', true);
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
        $query->whereHas('listings', fn($query) => $query->where('type', $listingType));
    }

    /**
     * Scope by search
     */
    public function scopeSearch(Builder $query, $search)
    {
        $query->whereLike('name', "%$search%")->orWhereHas(
            'listings',
            fn($query) => $query->whereLike('name', "%$search%")
        );
    }

    /**
     * Scope to retrieve by store type
     */
    public function scopeStoreType(Builder $query, $storeType)
    {
        return $query->where('type', $storeType);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory(Builder $query, $category)
    {
        $query->whereHas('listings', fn($query) => $query->where('category_id', $category));
    }

    /**
     * Scope by category
     */
    public function scopeForCategoryIn(Builder $query, array $categories)
    {
        return $query->whereExists(function ($query) use ($categories) {
            $query->selectRaw('1')->from('store_categories')
                ->whereColumn('store_categories.store_id', 'stores.id')
                ->whereIn('store_categories.category_id', $categories);
        });
    }

    /**
     * Scope by recommended
     */
    public function scopeRecommended(Builder $query)
    {
        $mostUsedCategories = app(FetchUserMostInteractedCategoriesAction::class)->fetch();
        $query->whereHas(
            'listings',
            fn($query) => $query->whereIntegerInRaw('category_id', $mostUsedCategories)
                ->orderByRaw("FIELD(category_id, " . implode(',', $mostUsedCategories) . ") DESC")
        );
    }

    /**
     * Scope by popular recommended
     */
    public function scopePopularRecommended(Builder $query)
    {
        $mostUsedCategories = app(FetchPopularRecommenationAction::class)->fetch();
        if (!empty($mostUsedCategories)) {
            $query->whereHas(
                'listings',
                fn($query) => $query->whereIntegerInRaw('category_id', $mostUsedCategories)
                    ->orderByRaw("FIELD(category_id, " . implode(',', $mostUsedCategories) . ") DESC")
            );
        }
    }

    /**
     * Scope by popular with limit
     */
    public function scopePopular(Builder $query)
    {
        $query->whereHas(
            'listings',
        )->take(10);
    }
}
