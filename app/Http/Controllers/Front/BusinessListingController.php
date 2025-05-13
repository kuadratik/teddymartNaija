<?php

namespace App\Http\Controllers\Front;

use App\Actions\Customer\BusinessScrapeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Advert\CreateAdvertRequest;
use App\Http\Requests\Advert\UpdateBusinessListingRequest;
use App\Http\Requests\Booking\BookServiceRequest;
use App\Models\BusinessListing;
use App\Models\BusinessServiceTimeSlot;
use App\Models\Industry;
use App\Models\UserBookBusinessService;
use App\Notifications\Booking\NewBookingNotification;
use App\Notifications\Listing\BizListedNotification;
use App\Support\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class BusinessListingController extends Controller
{

    /**
     * Get the list of businesses for directory
     */
    public function index(Request $request)
    {
        $query = BusinessListing::with('serviceAvailabilities')->search($request->search)
            ->byIndustry()
            ->byUser()
            ->byLocation()
            ->with(['country', 'industry'])
            ->when($request->filled('limit'), function ($q) use ($request) {
                $q->limit((int) $request->limit);
            })
            ->when(filter_var($request->query('random'), FILTER_VALIDATE_BOOLEAN), function ($q) {
                $q->inRandomOrder();
            });

        $businesses = $request->filled('per_page')
            ? $query->paginate((int) $request->per_page)
            : $query->get();

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
        return $this->success($businessListing->load([
            'industry',
            'country',
            'serviceAvailabilities',
            'serviceAvailabilities.timeSlots'
        ]));
    }

    /**
     * Book a service time slot for a business listing
     */
    public function bookService(BookServiceRequest $request, BusinessListing $businessListing)
    {
        return DB::transaction(function () use ($request, $businessListing) {
            $booking = UserBookBusinessService::create($request->bookingAttributes($businessListing));

            BusinessServiceTimeSlot::where('id', $request->validated('service_time_id'))
                ->update(['is_active' => false]);

            $businessOwner = $businessListing->user;
            $businessOwner->notify(new NewBookingNotification($booking, $businessListing));

            return $this->success($booking, 'Service time slot booked successfully.');
        });
    }


    /**
     * Create business listings
     */
    public function create(CreateAdvertRequest $request)
    {
        $business = BusinessListing::create($request->businessAttributes());

        foreach ($request->serviceAttributes() as $service) {
            $serviceAvailability = $business->serviceAvailabilities()->create([
                'service_name' => $service['service_name'],
                'availability_type' => $service['availability_type'],
            ]);

            if (!empty($service['time_slots'])) {
                $serviceAvailability->timeSlots()->createMany($service['time_slots']);
            }
        }

        Notification::route('mail', $business['business_email'])
            ->notify(new BizListedNotification($business));

        return $this->success($business->load('serviceAvailabilities.timeSlots'));
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

        if ($request->has('services')) {
            $businessListing->serviceAvailabilities()->delete();
            foreach ($request->serviceAttributes() as $service) {
                $serviceAvailability = $businessListing->serviceAvailabilities()->create([
                    'service_name' => $service['service_name'],
                    'availability_type' => $service['availability_type'],
                ]);

                if (!empty($service['time_slots'])) {
                    $serviceAvailability->timeSlots()->createMany($service['time_slots']);
                }
            }
        }

        return $this->success($businessListing->load('serviceAvailabilities.timeSlots'));
    }
}
