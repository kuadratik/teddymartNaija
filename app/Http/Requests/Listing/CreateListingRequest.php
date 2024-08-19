<?php

namespace App\Http\Requests\Listing;

use App\Enums\ListingType;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateListingRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'type' => ['required', 'string', Rule::enum(ListingType::class)],
            'price' => ['required_if:type,product', 'numeric'],
            'description' => ['required', 'string', 'max:200'],
            'additional_information' => ['nullable', 'string', 'max:200'],
            'images' => ['required', 'array'],
            'category' => ['required', 'integer', Rule::exists('categories', 'id')->where('type', $this->type)]
        ];
    }

    /**
     *  Move images to permanent storage.
     */
    public function images()
    {
        return Utils::moveToPermanentPath($this->safe()->images, 'images');
    }

    /**
     * Prepare store record to save
     */
    public function listingAttributes()
    {
        return collect($this->safe()->except(['images', 'category']))->merge([
            'category_id' => $this->category,
            'store_id' => $this->user()->store->id,
            'user_id' => $this->user()->id,
            'images' => $this->images(),
            'is_available' => true
        ])->toArray();
    }
}
