<?php

namespace App\Http\Requests\Listing;

use App\Enums\ListingType;
use App\Models\Store;
use App\Rules\PriceQuantityRule;
use App\Rules\ValidateDiscountRule;
use App\Rules\ValidatePriceRule;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
{
    protected ?Store $store = null;

    protected function prepareForValidation(): void
    {
        $this->store = $this->route('userStore');
    }

    private function getStore(): ?Store
    {
        return $this->store;
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $store = $this->getStore();
        $currency = $store?->currency ?? 'USD';

        $rules = [
            'is_draft' => ['required', 'boolean'],
            'name' => ['required_if:is_draft,false', 'string'],
            'type' => ['required_if:is_draft,false', 'string', Rule::enum(ListingType::class)],
            'price' => ['required_if:is_draft,false', 'numeric', new ValidatePriceRule($currency)],
            'description' => ['required_if:is_draft,false', 'string', 'max:3000'],
            'quantity' => ['required_if:is_draft,false', 'integer', new PriceQuantityRule($this->price)],
            'additional_information' => ['nullable', 'string', 'max:2000'],
            'images' => ['required_if:is_draft,false', 'array'],
            'category' => ['required_if:is_draft,false', 'integer', Rule::exists('categories', 'id')->where('type', $this->type)],
            'discount' => [
                'nullable',
                'numeric',
                'min:1',
                'max:99',
                new ValidateDiscountRule($this->price, $currency),
            ],
            'discount_start_date' => ['nullable', 'required_with:discount', 'date'],
            'discount_end_date' => ['nullable', 'required_with:discount', 'date', 'after:discount_start_date'],
            'sku' => ['nullable', 'string', 'max:50'],
            'weight' => ['nullable', 'numeric'],

            'attributes.measurement' => ['nullable', 'array'],
            'attributes.measurement.*' => ['nullable', 'array'],
            'attributes.measurement.*.value' => ['nullable', 'numeric'],
            'attributes.measurement.*.unit' => ['nullable', 'string'],
            'attributes.product_model' => ['nullable', 'string'],
            'attributes.brand' => ['nullable', 'string'],
            'attributes.material' => ['nullable', 'string'],
            'attributes.color' => ['nullable', 'string'],
            'attributes.size' => ['nullable', 'array'],
            'attributes.size.*' => ['nullable', 'string'],
            'attributes.tags' => ['nullable', 'array'],
            'attributes.tags.*' => ['nullable', 'string'],
            'attributes.size_chart_html' => ['nullable', 'string'],
            'attributes.size_chart_image' => ['nullable', 'string'],

            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['nullable', 'string'],
            'variants.*.quantity' => ['nullable', 'integer', 'min:0'],
            'variants.*.price' => ['nullable', 'numeric', 'min:1'],
            'variants.*.weight' => ['nullable', 'numeric'],
            'variants.*.discount' => ['nullable', 'numeric', 'min:1', 'max:99'],
            'variants.*.size' => ['nullable', 'string'],
            'variants.*.color' => ['nullable', 'string'],
            'variants.*.measurement' => ['nullable', 'array'],
            'variants.*.measurement.*' => ['nullable', 'array'],
            'variants.*.measurement.*.value' => ['nullable', 'numeric'],
            'variants.*.measurement.*.unit' => ['nullable', 'string'],
            'variants.*.discount_start_date' => ['nullable', 'required_with:variants.*.discount', 'date'],
            'variants.*.discount_end_date' => ['nullable', 'required_with:variants.*.discount', 'date', 'after:variants.*.discount_start_date'],
            'variants.*.images.*' => ['nullable', 'string'],
        ];

        foreach ($this->input('variants', []) as $index => $variant) {
            $price = $variant['price'] ?? null;
            $discount = $variant['discount'] ?? null;
            $rules["variants.$index.quantity"][] = new PriceQuantityRule($price);
            $rules["variants.$index.price"][] = new ValidatePriceRule($currency);
            if ($discount !== null) {
                $rules["variants.$index.discount"][] = new ValidateDiscountRule($price, $currency);
            }
        }

        return $rules;
    }

    public function images(array $data)
    {
        if (empty($data)) return [];
        return Utils::moveToPermanentPath($data, 'images');
    }

    public function listingAttributes(Store $userStore)
    {
        return collect($this->safe()->except(['images', 'category', 'attributes', 'variants']))
            ->merge([
                'category_id' => $this->category,
                'store_id' => $userStore->id,
                'user_id' => $this->user()->id,
                'images' => $this->images($this->safe()->images ?? []),
                'is_available' => true,
                'currency' => $userStore->currency
            ])->toArray();
    }

    public function listingAttributeAttributes()
    {
        return collect($this->safe()['attributes'] ?? [])->except(['size_chart_image', 'size', 'tags', 'measurement'])->merge([
            'size_chart_image' => $this->images([$this->safe()['attributes']['size_chart_image'] ?? null])[0] ?? null,
            'size' => json_encode($this->safe()['attributes']['size'] ?? []),
            'tags' => json_encode($this->safe()['attributes']['tags'] ?? []),
            'measurement' => json_encode($this->safe()['attributes']['measurement'] ?? [])
        ])->toArray();
    }

    public function variantsAttributes()
    {
        return collect($this->safe()['variants'] ?? [])->map(function ($variant) {
            return collect($variant)->except(['images', 'size', 'measurement'])->merge([
                'images' => $this->images($variant['images'] ?? []),
                'size' => json_encode($variant['size'] ?? []),
                'measurement' => json_encode($variant['measurement'] ?? [])
            ])->toArray();
        })->toArray();
    }
}
