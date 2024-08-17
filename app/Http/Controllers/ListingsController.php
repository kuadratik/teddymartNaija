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
    public function getUserStoreListings()
    {
        $userStoreListings = $this->user->store->listings()
            ->latest()->get();
        return $this->success($userStoreListings);
    }

    /**
     * Creates an user store listing based on the provided request.
     */
    public function create(CreateListingRequest $request)
    {
        Listing::create(array_merge(
            $request->validated(),
            [
                'store_id' => $this->user->store->id,
                'user_id' => $this->user->id,
                'category_id' => $request->category
            ]
        ));

        return $this->success();
    }

    /**
     * Display the specified user store listing.
     */
    public function show(Store $userStore, Listing $listing)
    {
        return $this->success($listing);
    }

    /**
     * Update the specified user store listing.
     */
    public function update(UpdateListingRequest $request, Store $userStore, Listing $listing)
    {
        $listing->update($request->validated());
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
}
