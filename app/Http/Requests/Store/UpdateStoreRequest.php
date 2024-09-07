<?php

namespace App\Http\Requests\Store;

use App\Rules\UniqueStoreName;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->userStore->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string' , new UniqueStoreName()],
            'contact_number' => ['required', 'string'],
            'whatsapp_number' => ['required', 'string'],
            'profile_picture_path' => ['required', 'string'],
            'banner_path' => ['required', 'string'],
            'description' => ['required', 'string'],
            'address1' => ['required', 'string'],
            'address2' => ['nullable', 'string'],
            'state' => ['required', 'string'],
            'city' => ['required', 'string'],
            'postal_code' => ['nullable', 'string'],
            'country' => ['nullable', 'integer' , 'exists:countries,id'],
        ];
    }

    /**
     * Prepare store record to save
     */
    public function storeAttributes()
    {
        return collect($this->safe()->except(['profile_picture_path', 'banner_path' , 'country']))
            ->merge([
                'banner_path' => Utils::moveToPermanentPath([$this->safe()->banner_path], 'images')[0]
                    ?? $this->userStore->banner_path,
                'profile_picture_path' => Utils::moveToPermanentPath([$this->safe()->profile_picture_path], 'images')[0]
                    ?? $this->userStore->profile_picture_path,
                'country_id' => $this->safe()->country
            ])->toArray();
    }
}
