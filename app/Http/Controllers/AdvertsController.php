<?php

namespace App\Http\Controllers;

use App\Http\Requests\Advert\CreateAdvertRequest;
use App\Models\BusinessListing;

class AdvertsController extends Controller
{
    public function create(CreateAdvertRequest $request)
    {
        $business = BusinessListing::create($request->validated());

        return $this->success($business);
    }
}
