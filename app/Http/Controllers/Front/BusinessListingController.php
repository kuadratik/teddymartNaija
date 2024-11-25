<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Advert\CreateAdvertRequest;
use App\Models\BusinessListing;
use App\Models\Industry;
use App\Notifications\Listing\BizListedNotification;
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
            ->when($request->filled('industry'))
            ->whereIn('industry_id', explode(',', $request->industry))
            ->paginate();

        return $this->success($businesses);
    }

    /**
     * Get the list of business industries
     */
    public function getIndustries(Request $request)
    {
        $industries = Industry::get();
        return $this->success($industries);
    }

    /**
     * Create business listings
     */
    public function create(CreateAdvertRequest $request)
    {
        $business = BusinessListing::create($request->businessAttributes());
        $business->notify(new BizListedNotification($business));
        
        return $this->success($business);
    }
}
