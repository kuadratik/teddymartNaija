<?php

namespace App\Http\Requests\Store;

use App\Enums\PayoutDetailType;
use App\Models\StorePayoutDetail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class SavePayoutDetailRequest extends FormRequest
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

        $requiredForInternation = 'required_if:detail_type,' . PayoutDetailType::INTERNATION->value;

        return [
            'store_id' => ['required',  Rule::exists('stores', 'id')->where('user_id', $this->user()->id)],
            'detail_type' => ['required', new Enum(PayoutDetailType::class)],
            'account_name' => ['required', 'string'],
            'account_number' => ['required'],
            'bank_name' => ['required', 'string'],
            'bank_code' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ],
            'iban' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ],
            'institution_number' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ],
            'transit_number' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ],
            'sort_code' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ],
            'interac_information' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ],
            'zelle_information' => [
                'nullable',
                fn($attr, $val, $fail) => $this->checkInternation($attr, $val, $fail),
                'string'
            ]

        ];
    }

    public function checkInternation($attribute, $val, $fail)
    {
        if (!is_null($val) && $this->detail_type !== PayoutDetailType::INTERNATION->value) {
            return $fail(':attribute is only for internation payout configuration');
        }
    }

    /**
     * Prepare payout attributes to save
     */
    public function payoutAttributes()
    {
        $hasDetail = StorePayoutDetail::where('store_id', $this->input('store_id'))->exists();

        return collect($this->validate())
            ->when(!$hasDetail)->merge(['is_default' => true])
            ->toArray();
    }
}
