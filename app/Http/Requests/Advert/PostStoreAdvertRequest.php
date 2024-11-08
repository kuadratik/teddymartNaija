<?php

namespace App\Http\Requests\Advert;

use App\Enums\CurrencyType;
use Illuminate\Foundation\Http\FormRequest;

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
            'store_id' => ['required','exists:stores,id'],
            'store_promote_plan_id' => ['required','exists:store_promote_plans,id'],
            'payment_id' => ['nullable','exists:payments,id'],
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
                'user_id' => $this->user()->id,
                'currency' => $this->header('currency', CurrencyType::USD->value)
            ]
        )->toArray();
    }
}
