<?php

namespace App\Http\Requests\Advert;

use App\Enums\CurrencyType;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\StoreHasListings;

class PostStoreAdvertRequest extends FormRequest
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
            'store_id' => ['required','exists:stores,id',new StoreHasListings()],
            'store_promote_plan_id' => ['required','exists:store_promote_plans,id'],
            'cancel_url' => ['sometimes', 'url'],
            'return_url' => ['sometimes', 'url'],
        ];
    }


    /**
     * Return an array of post advert attributes including media and user_id.
     *
     * @return array
     */
    public function postAdvertAttributes(): array
    {

        return collect($this->safe()->except(['return_url', 'cancel_url']))->merge(
            [
                'currency' => $this->header('currency', CurrencyType::USD->value)
            ]
        )->toArray();
    }
}
