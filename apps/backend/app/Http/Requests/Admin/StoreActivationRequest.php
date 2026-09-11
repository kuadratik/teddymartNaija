<?php

namespace App\Http\Requests\Admin;

use App\Enums\GeneralEnum;
use App\Models\Store;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use function PHPUnit\Framework\returnArgument;

class StoreActivationRequest extends FormRequest
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
            'all_stores' => ['required', 'boolean'],
            'active' => ['required', 'boolean'],
            'stores' => [
                $this->boolean('all_stores') ? 'required' : 'nullable',
                'array',
                'min:1',
                $this->checkStoreIds(...),
            ],
            'stores.*' => ['required', 'numeric'],
            'note' => ['required', 'string', 'max:500'],
            'payment_status' => ['nullable', Rule::in([GeneralEnum::SUCCESS, GeneralEnum::UNPAID])],
        ];
    }

    private function checkStoreIds($attr, $val, $fail)
    {
        $storeCount = Store::whereIn('id', $val)->count();

        if ($storeCount <= 0) {
            return $fail('Non of the selected stores was found');
        }

        if ($storeCount != count($val)) {
            return $fail('One of more of the selected is invalid please check your selections.ß');
        }
    }
}
