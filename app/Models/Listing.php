<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string, string>
     */
    protected $fillable = [
        'store_id',
        'user_id',
        'category_id',
        'name',
        'slug',
        'type',
        'price',
        'quantity',
        'discount',
        'discounted_price',
        'display_price',
        'description',
        'additional_information',
        'is_available',
        'views_count',
        'images',
        'currency',
        'discount_start_date',
        'discount_end_date',
        'is_draft',

    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * The attributes that should be casts
     */
    protected $casts = [
        'images' => 'array',
        'is_available' => 'boolean',
        'is_draft' => 'boolean',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime'
    ];

    /**
     * eager load relationships
     */
    protected $with = ['attributes', 'variants'];

    protected static function booted()
    {
        static::saving(function (Listing $model) {
            $model->slug = str($model->name)->slug();
            $companyRate = env('COMPANY_RATE', 0.13);
            $basePrice = $model->discount > 0
                ? $model->price * (1 - ($model->discount / 100))
                : $model->price;
            $model->discounted_price = $model->discount > 0 ? $basePrice : null;
            $model->display_price = $basePrice * (1 + $companyRate);
        });
    }

    /**
     *  get the product attributes
     */
    public function attributes()
    {
        return $this->hasOne(ListingAttribute::class);
    }

    /**
     * Get product variants
     */
    public function variants()
    {
        return $this->hasMany(ListingVariant::class);
    }

    /**
     * Get product variants
     */
    public function ratings()
    {
        return $this->hasMany(ListingRating::class);
    }

    /**
     * Get the store listing owner
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the user for this store listing
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category for this store listing
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory(Builder $query, string|null $category)
    {
        $query->when($category, fn(Builder $query) =>  $query->where('category_id', $category));
    }

    /**
     * Scope by type
     */
    public function scopeByType(Builder $query, string $type)
    {
        $query->where('type', $type);
    }

    /**
     * Scope by availability
     */
    public function scopeAvailability(Builder $query, $isAvailable)
    {
        $query->where('is_available',  filter_var($isAvailable, FILTER_VALIDATE_BOOL));
    }

    /**
     * scope by is_draft
     */
    public function scopeIsDraft(Builder $query, $isDraft)
    {
        $query->where('is_draft', filter_var($isDraft, FILTER_VALIDATE_BOOL));
    }

    /**
     * Scope by listing type
     */
    public function scopeByListingType($query, $listingType)
    {
        return $query->where('type', $listingType);
    }

    /**
     * Scope to search by name or store name
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('store', fn($query) => $query->where('name', 'like', "%{$search}%"));
        });
    }

    /**
     * Scope by popularity (available products or services with highest views_count)
     */
    public function scopePopular(Builder $query, string $type = null)
    {
        $query->where('is_available', true);

        if ($type === 'product' || $type === 'service') {
            $query->where('type', $type);
        }

        $query->orderByDesc('views_count');
    }


    /**
     * get cart that belongs to the listings
     */
    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_listing')
            ->withPivot('quantity')
            ->withTimestamps();
    }


    /**
     * Scope by currency
     */
    public function scopeByCurrency(Builder $query, string $currency)
    {
        $query->when($currency, fn(Builder $query) => $query->where('currency', $currency));
    }


    /**
     * Scope a query to only include listings that are currently on sale.
     *
     * A listing is considered on sale if it has a discount greater than 0,
     * and the current date is within the discount start and end dates.
     */
    public function scopeOnSale($query)
    {
        return $query->where('discount', '>', 0)
            ->whereNotNull('discount_start_date')
            ->whereNotNull('discount_end_date')
            ->where('discount_start_date', '<=', now())
            ->where('discount_end_date', '>=', now());
    }


    /**
     * Scope a query to only include listings that are in stock.
     *
     * A listing is considered in stock if its quantity is greater than zero.
     */
    public function scopeInStock($query)
    {
        return $query->where('quantity', '>', 0);
    }


    /**
     * Update the listing with the given attributes, listing attributes, and variants.
     *
     */
    public function updateListing(array $attributes, ?array $listingAttributes = null, ?array $variants = null)
    {
        return DB::transaction(function () use ($attributes, $listingAttributes, $variants) {
            $this->update($attributes);

            $this->when(!is_null($listingAttributes), function ($listing) use ($listingAttributes) {
                $this->attributes()->updateOrCreate(
                    ['listing_id' => $this->id],
                    $listingAttributes
                );
            });

            $this->when(!is_null($variants), function ($listing) use ($variants) {
                $this->variants()->delete();

                $listing->when(!empty($variants), function ($listingVariants) use ($variants) {
                    collect($variants)->each(function ($variantData) use ($listingVariants) {
                        $this->variants()->create(
                            $variantData
                        );
                    });
                });
            });

            return $this->refresh()->load(['attributes', 'variants']);
        });
    }

    public function checkExpiredDiscounts()
    {
        $currentDate = now();

        $expiredProducts = Listing::where('discount_end_date', '<', $currentDate)
            ->where('is_draft', false)
            ->get();

        foreach ($expiredProducts as $product) {
            $product->update([
                'price' => $product->display_price,
                'discounted_price' => null,
                'discount' => null,
                'discount_start_date' => null,
                'discount_end_date' => null
            ]);
        }
    }
}
