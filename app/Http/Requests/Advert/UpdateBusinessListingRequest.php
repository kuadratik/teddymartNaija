<?php

namespace App\Http\Requests\Advert;

use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessListingRequest extends FormRequest
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
            'business_name' => ['sometimes', 'string', 'max:50'],
            'business_description' => ['nullable', 'string'],
            'business_email' => ['nullable', 'email'],
            'secondary_business_email' => ['nullable', 'email'],
            'business_address' => ['nullable', 'string'],
            'country_id' => ['sometimes', 'numeric'],
            'state' => ['sometimes', 'string'],
            'business_contact_number' => ['sometimes', 'string'],
            'secondary_contact_number' => ['nullable', 'string'],
            'website_link' => ['nullable', 'string'],
            'color' => ['nullable', 'string'],
            'owner_role' => ['nullable', 'string'],
            'owner_name' => ['nullable', 'string'],
            'business_logo_url' => ['nullable', 'string'],
            'industry_id' => ['sometimes', 'exists:industries,id'],
            'show_business_description' => ['sometimes', 'boolean'],
            'show_business_email' => ['sometimes', 'boolean'],
            'show_business_address' => ['sometimes', 'boolean'],
            'show_secondary_email' => ['sometimes', 'boolean'],
            'show_secondary_contact' => ['sometimes', 'boolean'],
            'show_website_link' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Move media to permanent storage if a new logo is provided.
     */
    public function media()
    {
        if (!empty(basename($this->safe()->business_logo_url))) {
            return collect(Utils::moveToPermanentPath([$this->safe()->business_logo_url], 'business/media'))->first();
        }

        return null;
    }

    /**
     * Prepare update data.
     */
    public function businessAttributes()
    {
        return collect($this->safe()->except('business_logo_url'))
            ->put('business_logo_url', $this->media())
            ->toArray();
    }
}
