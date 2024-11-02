<?php

namespace App\Http\Requests\Advert;

use App\Enums\CurrencyType;
use App\Enums\ListingType;
use App\Rules\VideoDuration;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostAdvertRequest extends FormRequest
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
            'type' => ['required', 'enum:' . ListingType::class],
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')->where('type', $this->type)],
            'quantity' => ['nullable', 'integer'],
            'description' => ['required', 'string'],
            'price_on_request' => ['boolean'],
            'price' => ['nullable', 'numeric', 'min:0', 'required_if:price_on_request,false'],
            'state' => ['required', 'string'],
            'country_id' => ['required', 'exists:countries,id'],
            'phone_number' => ['required', 'string', 'max:20'],
            'country_code' => ['required', 'string', 'max:4'],
            'promote_plan_id' => ['required', 'exists:advert_promote_plans,id'],
            'media' => ['sometimes', 'array'],
            'media.*' => ['string'],
        ];
    }


    /**
     *  Move media to permanent storage.
     */
    public function media()
    {
        return Utils::moveToPermanentPath($this->safe()->media, 'advert/media');
    }



    /**
     * Return an array of post advert attributes including media and user_id.
     *
     * @return array
     */
    public function postAdvertAttributes(): array
    {
        return collect($this->safe()->except(['media']))->merge(
            [
                'media' => $this->media(),
                'user_id' => $this->user()->id,
                'currency' => $this->header('currency', CurrencyType::USD)
            ]
        )->toArray();
    }



}
