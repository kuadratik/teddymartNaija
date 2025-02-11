<?php

namespace App\Http\Controllers\Front;

use App\Actions\Customer\BusinessScrapeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Advert\CreateAdvertRequest;
use App\Http\Requests\Advert\UpdateBusinessListingRequest;
use App\Models\BusinessListing;
use App\Models\Industry;
use App\Notifications\Listing\BizListedNotification;
use App\Support\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class BusinessListingController extends Controller
{
    /**
     * Get the list of business for directory
     */
    public function index(Request $request)
    {
        $businesses = BusinessListing::search($request->search)
            ->byIndustry()->byUser()->byLocation()->with(['country', 'industry'])->paginate(16);

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
     * Site scraping for website information
     */
    public function scrapeBusinessInfo(Request $request, BusinessScrapeAction $action)
    {
        $request->validate(['url' => 'required|string']);
        $res = $action->handle($request->input('url'));

        return $this->success($res);
    }

    /**
     * show the business listing information
     */
    public function show(BusinessListing $businessListing)
    {
        return $this->success($businessListing->load(['industry', 'country']));
    }

    /**
     * Create business listings
     */
    public function create(CreateAdvertRequest $request)
    {
        $business = BusinessListing::create($request->businessAttributes());

        Notification::route('mail', $business['business_email'])
            ->notify(new BizListedNotification($business));

        return $this->success($business);
    }

    /**
     * Delete business listing
     */
    public function delete(Request $request, BusinessListing $businessListing)
    {
        abort_if($businessListing->user_id != $request->user()->id, 403, 'You are not allowed to perform this action');

        Utils::deleteSpaceFiles([$businessListing->business_logo_url]);
        $businessListing->delete();
        return $this->success();
    }

    /**
     * Update business listing information
     */
    public function update(UpdateBusinessListingRequest $request, BusinessListing $businessListing)
    {
        abort_if($businessListing->user_id != $request->user()->id, 403, 'You are not allowed to perform this action');

        $businessListing->update($request->businessAttributes());
        return $this->success($businessListing);
    }
}
