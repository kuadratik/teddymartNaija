<?php

namespace App\Http\Controllers;

use App\Http\Requests\Listing\AddRatingRequest;
use App\Http\Requests\Listing\CreateListingRequest;
use App\Http\Requests\Listing\UpdateListingRequest;
use App\Jobs\RecordCategoryInteractions;
use App\Models\Listing;
use App\Models\ListingRating;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingsController extends Controller
{
    protected $user;

    public function __construct(Request $request)
    {
        $this->user = $request->user();
    }

    /**
     * Retrieve the listings for a specific user store.
     */
    public function getUserStoreListings(Request $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $this->user->id, 403, "Unauthorized");

        $userStoreListings = $userStore->listings()
            ->latest()
            ->byType($request->listingType)
            ->when($request->filled('availability'), function ($query) use ($request) {
                $query->availability($request->availability);
            })
            ->when($request->filled('is_draft'), function ($query) use ($request) {
                $query->isDraft($request->query('is_draft'));
            })
            ->with('ratings')
            ->paginate();

        return $this->success($userStoreListings);
    }


    /**
     * Create a new listing for the specified user store.
     */
    public function create(CreateListingRequest $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $this->user->id, 402, "Unauthorized");

        return DB::transaction(function () use ($request, $userStore) {
            $listing = Listing::create($request->listingAttributes($userStore));

            $listing->attributes()->create($request->listingAttributeAttributes());

            $variantsAttributes = $request->variantsAttributes();
            if (!empty($variantsAttributes)) {
                foreach ($variantsAttributes as $variant) {
                    $listing->variants()->create($variant);
                }
            }

            return $this->success($listing);
        });
    }

    /**
     * Display the specified user store listing.
     */
    public function showUserStoreListing(Store $userStore, Listing $listing)
    {

        return $this->success($listing);
    }

    /**
     * Display the specified store listing.
     */
    public function show(Store $Store, Listing $listing)
    {
        return $this->success($listing->load(['variants', 'attributes', 'ratings','store']));
    }

    /**
     * Set availabilty to the specified user store listing.
     */
    public function setAvailability(Request $request, Store $userStore, Listing $listing)
    {
        $validatedData = $request->validate(['is_available' => ['required', 'boolean']]);
        $listing->update(['is_available' => $validatedData['is_available']]);

        return $this->success();
    }

    /**
     * Update the specified user store listing.
     */
    public function update(UpdateListingRequest $request, Store $userStore, Listing $listing)
    {
        $listing = $listing->updateListing(
            $request->listingAttributes($userStore),
            $request->has('attributes') ? $request->listingAttributeAttributes() : null,
            $request->has('variants') ? $request->variantsAttributes() : null
        );

        return $this->success($listing);
    }

    /**
     * Delete the specified user store listing.
     */
    public function delete(Store $userStore, Listing $listing)
    {
        $listing->delete();
        return $this->success();
    }

    /**
     * add listing views count
     */
    public function addListingViewsCount(Listing $listing)
    {
        $listing->increment('views_count');
        return $this->success();
    }

    /**
     * Add rating to listing
     */
    public function addRating(AddRatingRequest $request)
    {
        ListingRating::create($request->ratingAttributes());
        return $this->success();
    }

    /**
     * Get popular listings based on views, with optional currency filter.
     */
    public function getPopularListing(Request $request)
    {

        $currency = $request->header('currency', 'USD');

        $listing = Listing::query()
            ->popular($request->query('listingType'))
            ->byCurrency($currency)
            ->with('store')
            ->where('is_available', true)
            ->get();

        return $this->success($listing);
    }

    /**
     *   Listing by type with search and currency filter
     */
    public function getListings(Request $request)
    {
        $currency = $request->header('currency', 'USD');

        $listings = Listing::query()
            ->byListingType($request->listingType)
            ->when($request->search, fn($query) => $query->search($request->search))
            ->when($request->category, fn($query) => $query->byCategory($request->category))
            ->when($request->availability, fn($query) => $query->availability($request->availability))
            ->byCurrency($currency)
            ->get();

        RecordCategoryInteractions::dispatch($request->search, $request->header('interactUid'));

        return $this->success($listings->load('store', 'ratings'));
    }
}
