<?php

namespace App\Http\Requests\Store;

use App\Enums\CurrencyType;
use App\Enums\GeneralEnum;
use App\Enums\StoreType;
use App\Models\Category;
use App\Models\Country;
use App\Models\Store;
use App\Rules\SupportedCountry;
use App\Rules\UniqueStoreName;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class CreateStoreRequest extends FormRequest
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
        $step = strval($this->route('step'));

        abort_if(!in_array($step, ['1', '2', '3']), Response::HTTP_BAD_REQUEST, 'The selected step is invalid');

        $stepOneRules = [
            'id' => ['nullable', 'numeric', fn($attr, $val, $fail) => $this->storeExists($attr, $val, $fail)],
            'name' => ['required', 'string', new UniqueStoreName()],
            'categories' => [
                'required',
                'array',
                'min:1',
                function ($attr, $val, $fail) {
                    if (count($val) != Category::where('type', GeneralEnum::STORE)->whereIn('id', $val)->count()) {
                        return $fail('One or more of the selected categories is invalid');
                    }
                }
            ],
            'categories.*' => ['required', 'numeric'],
            'contact_number' => ['required', 'string'],
            'whatsapp_number' => ['required', 'string'],
            'description' => ['required', 'string'],
            'address1' => ['required', 'string'],
            'address2' => ['nullable', 'string'],
            'state' => ['required', 'string'],
            'city' => ['required', 'string'],
            'postal_code' => ['nullable', 'string'],
            'country_id' => ['required', 'integer', new SupportedCountry()],
            'offers_service' => ['required', 'boolean'],
            'offers_product' => ['required', 'boolean'],
            'type' => ['required', Rule::enum(StoreType::class), 'string'],
        ];

        $stepTwoRules = [
            'profile_picture_path' => ['nullable', 'string'],
            'banner_path' => ['nullable', 'string']
        ];

        return match ($step) {
            '1' => $stepOneRules,
            '2' => [
                'id' => ['required', 'numeric', fn($attr, $val, $fail) => $this->storeExists($attr, $val, $fail)],
                ...$stepOneRules,
                ...$stepTwoRules
            ],
            '3' => [
                'id' => ['required', 'numeric', fn($attr, $val, $fail) => $this->storeExists($attr, $val, $fail)],
                ...$stepOneRules,
                ...$stepTwoRules,
                'return_url' => ['required', 'string', 'url'],
                'cancel_url' => ['required', 'string', 'url'],
            ]
        };
    }

    public function storeExists($attr, $val, $fail)
    {
        $store = Store::where('id', $val)->where('user_id', $this->user()->id)->first();

        if (is_null($store)) {
            return $fail('The selected store is invalid');
        }

        if ($store->payment_status == GeneralEnum::PAID->value) {
            return $fail('The selected Store already has payment');
        }
    }

    /**
     * Prepare store record to save
     */
    public function storeAttributes()
    {
        $country = Country::find($this->safe()->country);

        return collect($this->safe()
            ->except(['profile_picture_path', 'offers_service', 'offers_product', 'banner_path', 'country']))
            ->merge([
                'user_id' => $this->user()->id,
                'banner_path' => Utils::moveToPermanentPath([$this->safe()->banner_path], 'images')[0],
                'profile_picture_path' => Utils::moveToPermanentPath([$this->safe()->profile_picture_path], 'images')[0],
                'country_id' => $this->safe()->country,
                'currency' => $country?->currency_code ?? CurrencyType::USD
            ])->toArray();
    }
}
