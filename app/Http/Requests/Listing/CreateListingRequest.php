<?php

namespace App\Http\Requests\Listing;

use App\Enums\CurrencyType;
use App\Enums\ListingType;
use App\Models\Store;
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
            'description' => ['required', 'string', 'max:500'],
            'additional_information' => ['nullable', 'string', 'max:1000'],
            'quantity' => ['required', 'integer', 'min:0'],
            'images' => ['required', 'array'],
            'category' => ['required', 'integer', Rule::exists('categories', 'id')->where('type', $this->type)],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'discount_start_date' => ['nullable', 'required_with:discount', 'date'],
            'discount_end_date' => ['nullable', 'required_with:discount', 'date', 'after:discount_start_date'],
            'sku' => ['nullable', 'string', 'max:50'],
            'is_draft' => ['required', 'boolean'],

            'attributes.measurement' => ['nullable', 'string'],
            'attributes.product_model' => ['nullable', 'string'],
            'attributes.brand' => ['nullable', 'string'],
            'attributes.material' => ['nullable', 'string'],
            'attributes.color' => ['nullable', 'string'],
            'attributes.size' => ['sometimes', 'array'],
            'attributes.size.*' => ['required', 'array'],
            'attributes.size.*.size' => ['required', 'string'],
            'attributes.size.*.unit' => ['required', 'string'],
            'attributes.tags' => ['nullable', 'array'],
            'attributes.tags.*' => ['nullable', 'string'],
            'attributes.size_chart_html' => ['nullable', 'string'],
            'attributes.size_chart_image' => ['nullable', 'string'],

            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required', 'string'],
            'variants.*.quantity' => ['required', 'integer', 'min:0'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'variants.*.size' => ['sometimes', 'array'],
            'variants.*.size.*.size' => ['required', 'string'],
            'variants.*.size.*.unit' => ['required', 'string'],
            'variants.*.color' => ['nullable', 'string'],
            'variants.*.measurement' => ['nullable', 'string'],
            'variants.*.discount_start_date' => ['nullable', 'required_with:variants.*.discount', 'date'],
            'variants.*.discount_end_date' => ['nullable', 'required_with:variants.*.discount', 'date', 'after:variants.*.discount_start_date'],
            'variants.*.images.*' => ['nullable', 'string'],
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
        return collect($this->safe()->except(['images', 'category', 'attributes', 'variants']))->merge([
            'category_id' => $this->category,
            'store_id' => $userStore->id,
            'user_id' => $this->user()->id,
            'images' => $this->images($this->safe()->images),
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
            'size_chart_image' => $this->images([$this->safe()['attributes']['size_chart_image']] ?? [])[0],
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
