<?php

namespace App\Http\Controllers;

use App\Http\Requests\Listing\CreateListingRequest;
use App\Http\Requests\Listing\UpdateListingRequest;
use App\Models\Listing;
use App\Models\Store;
use Illuminate\Http\Request;

class ListingsController extends Controller
{
    protected $user;

    public function __construct(Request $request)
    {
        $this->user = $request->user();
    }

    /**
     * Display a listing of user store listing.
     */
    public function getUserStoreListings(Request $request)
    {
        $userStoreListings = $this->user->store->listings()
            ->latest()->byType($request->listingType)
            ->availability($request->availability)
            ->paginate();

        return $this->success($userStoreListings);
    }

    /**
     * Creates an user store listing based on the provided request.
     */
    public function create(CreateListingRequest $request)
    {
        Listing::create($request->listingAttributes());
        return $this->success();
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
        return $this->success($listing);
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
        $listing->update($request->listingAttributes());
        return $this->success();
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
}
