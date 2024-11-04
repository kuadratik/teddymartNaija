<?php

namespace App\Http\Controllers;

use App\Enums\CurrencyType;
use App\Http\Requests\Advert\PostAdvertRequest;
use App\Models\AdvertListing;
use App\Models\User;
use App\Services\Advert\AdvertListingService;
use Illuminate\Http\Request;

class AdvertListingController extends Controller
{

    public function __construct(protected AdvertListingService $advertListingService)
    {
        //
    }

    /**
     * Store a new advert listing.
     */
    public function postAdvert(PostAdvertRequest $request)
    {
        $listing = $this->advertListingService->create($request->postAdvertAttributes(), $request->validated('return_url'), $request->validated('cancel_url'));
        return  $this->success();
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
}
