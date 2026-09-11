<?php

namespace App\Http\Requests\Store;

use App\Enums\GeneralEnum;
use App\Enums\StoreType;
use App\Models\Category;
use App\Rules\UniqueStoreName;
use App\Support\Utils;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'country_id' => ['nullable', 'integer' , 'exists:countries,id'],
            'type' => ['required', Rule::enum(StoreType::class), 'string']

        ];
    }

    /**
     * Prepare store record to save
     */
    public function storeAttributes()
    {
        return collect($this->safe()->except(['profile_picture_path', 'banner_path', 'categories', 'country_id']))
            ->merge([
                'banner_path' => Utils::moveToPermanentPath([$this->safe()->banner_path], 'images')[0]
                    ?? $this->userStore->banner_path,
                'profile_picture_path' => Utils::moveToPermanentPath([$this->safe()->profile_picture_path], 'images')[0]
                    ?? $this->userStore->profile_picture_path,
                'country_id' => $this->safe()->country_id
            ])->toArray();
    }
}
