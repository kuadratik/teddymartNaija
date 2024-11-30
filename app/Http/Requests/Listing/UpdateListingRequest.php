<?php

namespace App\Http\Requests\Listing;

use App\Enums\ListingType;
use App\Models\Store;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
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
            'name' => ['sometimes', 'string'],
            'type' => ['sometimes', 'string', Rule::enum(ListingType::class)],
            'price' => ['sometimes', 'numeric'],
            'description' => ['sometimes', 'string', 'max:500'],
            'additional_information' => ['sometimes', 'string', 'max:1000'],
            'images' => ['sometimes', 'array'],
            'category' => ['sometimes', 'integer', Rule::exists('categories', 'id')->where('type', $this->type)],
            'discount' => ['', 'numeric', 'min:0', 'max:100'],
            'discount_start_date' => ['sometimes', 'required_with:discount', 'date'],
            'discount_end_date' => ['sometimes', 'required_with:discount', 'date', 'after:discount_start_date'],
            'sku' => ['sometimes', 'string', 'max:50'],
            'is_draft' => ['sometimes', 'boolean'],

            'attributes.measurement' => ['nullable', 'string'],
            'attributes.product_model' => ['nullable', 'string'],
            'attributes.brand' => ['sometimes', 'string'],
            'attributes.material' => ['sometimes', 'string'],
            'attributes.color' => ['sometimes', 'string'],
            'attributes.size' => ['sometimes', 'array'],
            'attributes.size.*' => ['required', 'array'],
            'attributes.size.*.size' => ['required', 'string'],
            'attributes.size.*.unit' => ['required', 'string'],
            'attributes.tags' => ['sometimes', 'array'],
            'attributes.tags.*' => ['sometimes', 'string'],
            'attributes.size_chart_html' => ['sometimes', 'string'],
            'attributes.size_chart_image' => ['sometimes', 'string'],

            'variants' => ['sometimes', 'array'],
            'variants.*.name' => ['sometimes', 'string'],
            'variants.*.quantity' => ['sometimes', 'integer', 'min:0'],
            'variants.*.price' => ['sometimes', 'numeric', 'min:0'],
            'variants.*.discount' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'variants.*.size' => ['sometimes', 'array'],
            'variants.*.size.*.size' => ['required', 'string'],
            'variants.*.size.*.unit' => ['required', 'string'],
            'variants.*.color' => ['sometimes', 'string'],
            'variants.*.measurement' => ['sometimes', 'string'],
            'variants.*.discount_start_date' => ['sometimes', 'required_with:variants.*.discount', 'date'],
            'variants.*.discount_end_date' => ['sometimes', 'required_with:variants.*.discount', 'date', 'after:variants.*.discount_start_date'],
            'variants.*.images.*' => ['sometimes', 'string'],
        ];
    }

    /**
     * Move images to permanent storage.
     */
    public function images(array $data)
    {
        return Utils::moveToPermanentPath($data, 'images');
    }

    /**
     * Prepare store record to save
     */
    public function listingAttributes(Store $userStore)
    {
        return collect($this->safe()->except(['images', 'category', 'attributes', 'variants']))
            ->filter() // Remove null values
            ->merge([
                'category_id' => $this->category,
                'store_id' => $userStore->id,
                'user_id' => $this->user()->id,
                'images' => $this->images($this->safe()->images ?? []),
                'is_available' => true,
                'currency' => $userStore->currency
            ])->toArray();
    }

    /**
     * Prepare ListingAttributeAttributes for saving.
     */
    public function listingAttributeAttributes()
    {
        return collect($this->safe()['attributes'] ?? [])->except(['size_chart_image', 'size', 'tags'])->merge([
            'size_chart_image' => $this->images([$this->safe()['attributes']['size_chart_image'] ?? null])[0] ?? null,
            'size' => json_encode($this->safe()['attributes']['size'] ?? []),
            'tags' => json_encode($this->safe()['attributes']['tags'] ?? []),
        ])->toArray();
    }

    /**
     * Prepare Variants Attributes for saving.
     */
    public function variantsAttributes()
    {
        return collect($this->safe()['variants'] ?? [])->map(function ($variant) {
            return collect($variant)->except(['images', 'size'])->merge([
                'images' => $this->images($variant['images'] ?? []),
                'size' => json_encode($variant['size'] ?? [])
            ])->toArray();
        })->toArray();
    }
}
