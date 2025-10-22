<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class FilterBrandsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'category_ids' => 'nullable',
            'category_ids.*' => 'integer|exists:brand_categories,id',
            'is_active' => 'nullable',
            'per_page' => 'nullable|integer|min:1|max:100',
            'include_archived' => 'nullable',
        ];
    }

    public function filters(): array
    {
        $filters = $this->validated();

        foreach (['is_active', 'include_archived'] as $key) {
            if (isset($filters[$key])) {
                $filters[$key] = filter_var($filters[$key], FILTER_VALIDATE_BOOLEAN);
            }
        }

        return $filters;
    }

    public function perPage(): int
    {
        return $this->input('per_page', 5);
    }
}
