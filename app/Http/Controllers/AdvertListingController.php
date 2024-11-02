<?php

namespace App\Http\Controllers;

use App\Http\Requests\Advert\PostAdvertRequest;
use App\Models\AdvertListing;
use Illuminate\Http\Request;

class AdvertListingController extends Controller
{

    /**
     * Store a new advert listing.
     */
    public function postAdvert(PostAdvertRequest $request)
    {
        $res = AdvertListing::create($request->postAdvertAttributes());
        return  $this->success();
    }
}
