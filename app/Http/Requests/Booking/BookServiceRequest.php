<?php

namespace App\Http\Requests\Booking;

use App\Models\BusinessListing;
use App\Models\BusinessServiceTimeSlot;
use App\Models\UserBookBusinessService;
use Illuminate\Foundation\Http\FormRequest;

class BookServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'business_service_id' => [
                'required',
                'exists:business_service_availabilities,id'
            ],
            'service_time_id' => [
                'required',
                'exists:business_service_time_slots,id'
            ],
            'cus_phone_number' => [
                'required',
                'string',
                'max:15'
            ],
            'cus_email' => [
                'required',
                'email',
                'max:255'
            ],
            'cus_fullname' => [
                'required',
                'string',
                'max:255'
            ],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = $this->user();
            logger()->info('User ID:', ['user_id' => $user]);

            $existingBooking = UserBookBusinessService::where('user_id', $user->id)
                ->where('business_service_id', $this->input('business_service_id'))
                ->exists();

            if ($existingBooking) {
                $validator->errors()->add('business_service_id', 'You have already booked a time slot for this service.');
            }

            $timeSlot = BusinessServiceTimeSlot::find($this->input('service_time_id'));
            if ($timeSlot && !$timeSlot->is_active) {
                $validator->errors()->add('service_time_id', 'The selected time slot is not available.');
            }
        });
    }

    /**
     * Extract attributes for creating a booking.
     *
     * @param BusinessListing $businessListing
     * @return array
     */
    public function bookingAttributes(BusinessListing $businessListing): array
    {
        return collect($this->validated())
            ->merge([
                'user_id' => $this->user()->id,
                'business_listing_id' => $businessListing->id,
            ])
            ->toArray();
    }
}
