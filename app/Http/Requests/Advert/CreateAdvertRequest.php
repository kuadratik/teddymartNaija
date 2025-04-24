<?php

namespace App\Http\Requests\Advert;

use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;

class CreateAdvertRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_name' => ['required', 'string', 'max:50'],
            'business_description' => ['nullable', 'string'],
            'business_email' => ['nullable', 'email'],
            'secondary_business_email' => ['nullable', 'email'],
            'business_address' => ['nullable', 'string'],
            'country_id' => ['required', 'numeric'],
            'state' => ['required', 'string'],
            'business_contact_number' => ['required', 'string'],
            'secondary_contact_number' => ['nullable', 'string'],
            'website_link' => ['nullable', 'string'],
            'color' => ['nullable', 'string'],
            'owner_role' => ['nullable', 'string'],
            'owner_name' => ['nullable'],
            'business_logo_url' => ['nullable', 'string'],
            'industry_id' => ['required', 'exists:industries,id'],
            'show_business_description' => ['required', 'boolean'],
            'show_business_email' => ['required', 'boolean'],
            'show_business_address' => ['required', 'boolean'],
            'show_secondary_email' => ['required', 'boolean'],
            'show_secondary_contact' => ['required', 'boolean'],
            'show_website_link' => ['required', 'boolean'],
            'services' => ['nullable', 'array'],
            'services.*.service_name' => ['required', 'string'],
            'services.*.availability_type' => ['required', 'string'],
            'services.*.time_slots' => ['required', 'array'],
            'services.*.time_slots.*.day_of_week' => ['nullable', 'string'],
            'services.*.time_slots.*.start_time' => ['required_with:services.*.time_slots', 'date_format:H:i'],
            'services.*.time_slots.*.end_time' => ['required_with:services.*.time_slots', 'date_format:H:i', 'after:services.*.time_slots.*.start_time'],
            'services.*.time_slots.*.date' => ['nullable', 'date_format:Y-m-d'],
        ];
    }

    /**
     *  Move media to permanent storage.
     */
    public function mediaPath()
    {
        if (!empty(basename($this->safe()->business_logo_url))) {
            return collect(Utils::moveToPermanentPath([$this->safe()->business_logo_url], 'business/media'))->first();
        }

        return null;
    }

    /**
     * Prepare store record to save
     */
    public function businessAttributes()
    {
        return collect($this->safe()->except('business_logo_url', 'services'))->merge([
            'business_logo_url' => $this->mediaPath(),
            'user_id' => $this->user()->id
        ])->toArray();
    }

    /**
     * Prepare service availability records
     */
    public function serviceAttributes(): array
    {
        if (!$this->has('services')) {
            return [];
        }

        return collect($this->safe()->services)->map(function ($service) {
            return [
                'service_name' => $service['service_name'],
                'availability_type' => $service['availability_type'],
                'time_slots' => $this->prepareTimeSlots($service['time_slots'] ?? [])
            ];
        })->toArray();
    }

    /**
     * Prepare time slots records
     */
    private function prepareTimeSlots(array $timeSlots): array
    {
        return collect($timeSlots)->map(function ($slot) {
            return [
                'day_of_week' => $slot['day_of_week'] ?? null,
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'is_active' => true,
                'date' => $slot['date'] ?? null
            ];
        })->toArray();
    }
}
