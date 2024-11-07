<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Advert\CreateAdvertRequest;
use App\Models\BusinessListing;
use Illuminate\Http\Request;

class BusinessListingController extends Controller
{
    /**
     * Get the list of business for directory
     */
    public function index(Request $request)
    {

        $businesses = BusinessListing::when($request->filled('search'))
            ->where('business_name', 'LIKE', "%{$request->search}%")
            ->when($request->filled('category'))
            ->whereIn('category_id', explode(',', $request->category))
            ->paginate();

        return $this->success($businesses);
    }

    /**
     * Create business listings
     */
    public function create(CreateAdvertRequest $request)
    {
        $business = BusinessListing::create($request->validated());

        return $this->success($business);
    }
}
