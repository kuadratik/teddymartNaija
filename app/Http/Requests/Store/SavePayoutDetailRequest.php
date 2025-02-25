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
     */
    public function rules(): array
    {
        $internationType = PayoutDetailType::INTERNATION->value;

        return [
            'store_id' => [
                'required',
                Rule::exists('stores', 'id')->where('user_id', $this->user()->id)
            ],
            'detail_type' => ['required', new Enum(PayoutDetailType::class)],
            'account_name' => ['required', 'string'],
            'account_number' => ['required'],
            'bank_name' => ['required', 'string'],
            'bank_code' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
            'iban' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
            'institution_number' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
            'transit_number' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
            'sort_code' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
            'interac_information' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
            'zelle_information' => ['nullable', "prohibited_unless:detail_type,{$internationType}", 'string'],
        ];
    }

    /**
     * Prepare payout attributes to save
     */
    public function payoutAttributes(): array
    {
        $attributes = $this->validated();

        if (!StorePayoutDetail::where('store_id', $this->input('store_id'))->exists()) {
            $attributes['is_default'] = true;
        }

        return $attributes;
    }
}
