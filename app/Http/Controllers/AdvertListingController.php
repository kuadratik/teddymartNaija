<?php

namespace App\Http\Controllers;

use App\Http\Requests\Advert\PostAdvertRequest;
use App\Models\AdvertListing;
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
        $listing = $this->advertListingService->create($request->postAdvertAttributes());
        return  $this->success();
    }
}
