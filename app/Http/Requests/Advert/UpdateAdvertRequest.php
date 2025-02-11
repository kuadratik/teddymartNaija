<?php

namespace App\Http\Requests\Advert;

use App\Enums\CurrencyType;
use App\Enums\ListingType;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdvertRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the update request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'type' => ['sometimes', Rule::enum(ListingType::class)],
            'title' => ['sometimes', 'string', 'max:255'],
            'category_id' => [
                'sometimes',
                'integer',
                Rule::exists('categories', 'id'),
            ],
            'quantity' => ['nullable', 'integer'],
            'description' => ['sometimes', 'string'],
            'price_on_request' => ['sometimes', 'boolean'],
            'price' => ['nullable', 'numeric', 'min:0', Rule::requiredIf(fn() => !$this->price_on_request)],
            'state' => ['sometimes', 'string'],
            'country_id' => ['sometimes', 'exists:countries,id'],
            'phone_number' => ['sometimes', 'string', 'max:20'],
            'country_code' => ['sometimes', 'string', 'max:4'],
            'promote_plan_id' => ['sometimes', 'exists:advert_promote_plans,id'],
            'media' => ['sometimes', 'array'],
            'media.*' => ['string'],
            'cancel_url' => ['sometimes', 'url'],
            'return_url' => ['sometimes', 'url'],
        ];
    }

    /**
     * Move media to permanent storage if provided.
     */
    public function media()
    {
        return $this->has('media') ? Utils::moveToPermanentPath($this->safe()->media, 'advert/media') : null;
    }

    /**
     * Return an array of update advert attributes including media and user_id.
     *
     * @return array
     */
    public function updateAdvertAttributes(): array
    {
        return collect($this->safe()->except(['media', 'return_url', 'cancel_url']))->merge([
            'media' => $this->media(),
            'user_id' => $this->user()->id,
            'currency' => $this->header('currency', CurrencyType::USD->value),
        ])->filter()->toArray();
    }
}
