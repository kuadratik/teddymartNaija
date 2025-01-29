<?php

namespace App\Http\Requests\Advert;

use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessAdvertRequest extends FormRequest
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
            'business_name' => ['sometimes', 'string', 'max:20'],
            'business_description' => ['nullable', 'string'],
            'business_email' => ['nullable', 'email'],
            'business_address' => ['nullable', 'string'],
            'business_contact_number' => ['sometimes', 'string'],
            'business_logo_url' => ['nullable', 'string'],
            'industry_id' => ['sometimes', 'exists:industries,id'],
            'show_business_description' => ['sometimes', 'boolean'],
            'show_business_email' => ['sometimes', 'boolean'],
            'show_business_address' => ['sometimes', 'boolean']
        ];
    }

    /**
     * Move media to permanent storage if a new logo is provided.
     */
    public function media()
    {
        if ($this->has('business_logo_url')) {
            return Utils::moveToPermanentPath([$this->safe()->business_logo_url], 'business/media');
        }
        return null;
    }

    /**
     * Prepare update data.
     */
    public function businessAttributes()
    {
        $attributes = collect($this->safe()->except('business_logo_url'));

        if ($this->has('business_logo_url')) {
            $attributes->put('business_logo_url', $this->media()[0]);
        }

        return $attributes->toArray();
    }
}
