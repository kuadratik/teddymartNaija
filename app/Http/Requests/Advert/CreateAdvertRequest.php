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
            'business_name' => ['required', 'string', 'max:20'],
            'business_description' => ['nullable', 'string'],
            'business_email' => ['nullable', 'email'],
            'business_address' => ['nullable', 'string'],
            'business_contact_number' => ['required', 'string'],
            'business_logo_url' => ['nullable', 'string'],
            'industry_id' => ['required', 'exists:industries,id'],
            'show_business_description' => ['required', 'boolean'],
            'show_business_email' => ['required', 'boolean'],
            'show_business_address' => ['required', 'boolean']
        ];
    }

    /**
     *  Move media to permanent storage.
     */
    public function media()
    {
        return Utils::moveToPermanentPath([$this->safe()->business_logo_url], 'business/media');
    }

    /**
     * Prepare store record to save
     */
    public function businessAttributes()
    {
        return collect($this->safe()->except('business_logo_url'))->merge([
            'business_logo_url' => $this->media()[0]
        ])->toArray();
    }
}
