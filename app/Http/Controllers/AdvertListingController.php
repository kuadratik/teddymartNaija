<?php

namespace App\Http\Controllers;

use App\Enums\CurrencyType;
use App\Http\Requests\Advert\PostAdvertRequest;
use App\Http\Requests\Advert\PostStoreAdvertRequest;
use App\Http\Requests\Advert\UpdateAdvertRequest;
use App\Models\AdvertListing;
use App\Models\User;
use App\Services\Advert\AdvertListingService;
use App\Services\Advert\PromoteStoreService;
use Illuminate\Http\Request;

class AdvertListingController extends Controller
{

    public function __construct(protected AdvertListingService $advertListingService, protected PromoteStoreService $promoteStoreService)
    {
        //
    }

    /**
     * Store a new advert listing.
     */
    public function postAdvert(PostAdvertRequest $request)
    {
        $listing = $this->advertListingService->create(
            $request->postAdvertAttributes(),
            $request->validated('return_url'),
            $request->validated('cancel_url')
        );
        return  $this->success($listing);
    }

    /**
     * update an advert
     */
    public function updateAdvert(UpdateAdvertRequest $request, AdvertListing $advert)
    {

        $listing = $this->advertListingService->update($advert, $request->updateAdvertAttributes(), $request->validated('return_url'), $request->validated('cancel_url'));
        return  $this->success($listing);
    }

    /**
     * Get the available advert plans..
     *
     * @return mixed The available advert plans.
     */
    public function getAdvertPlans(Request $request)
    {
        $currency = $request->header('currency', CurrencyType::USD->value);
        $plans = $this->advertListingService->getAdvertPlans($currency);
        return $this->success($plans);
    }

    /**
     * Get the available store promotion plans..
     *
     * @return mixed The available advert plans.
     */
    public function getPromotionPlans(Request $request)
    {
        $currency = $request->header('currency', CurrencyType::USD->value);
        $plans = $this->promoteStoreService->getPromotionPlans($currency);
        return $this->success($plans);
    }

    /**
     * Get the adverts for the current user.
     *
     */
    public function getUserAdverts(Request $request)
    {
        $ads = $this->advertListingService->getUserAdverts($request);
        return $this->success($ads);
    }

    /**
     * Get all adverts.
     */
    public function getAllAdverts(Request $request)
    {
        $ads = $this->advertListingService->getAllAdverts($request);
        return $this->success($ads);
    }

    /**
     * Get all adverts.
     */
    public function getAllPromotedStores(Request $request)
    {
        $ads = $this->promoteStoreService->getStoresWithActivePromotions($request);
        return $this->success($ads);
    }
    
    public function getUserPromotedStore(Request $request)
    {
        $ads = $this->promoteStoreService->getUserPromotedStore($request);
        return $this->success($ads);
    }

    /**
     *  Show the advert listing..
     */
    public function showAdvert(AdvertListing $advert)
    {
        return $this->success($advert->load([
            'user',
            'media',
            'category',
            'payment',
            'promotePlans'
        ]));
    }

    /**
     * Store a new store advert listing.
     */
    public function postStoreAdvert(PostStoreAdvertRequest $request)
    {
        $listing = $this->promoteStoreService->create($request->postAdvertAttributes(), $request->validated('return_url'), $request->validated('cancel_url'));
        return  $this->success($listing);
    }
}
