<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class FilterBrandsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // You can add admin authorization logic if needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:brand_categories,id',
            'is_active' => 'nullable',
            'per_page' => 'nullable|integer|min:1|max:100',
            'include_archived' => 'nullable|boolean',
        ];
    }

    /**
     * Sanitize and cast inputs.
     */
    public function filters(): array
    {
        $filters = $this->validated();

        if (isset($filters['is_active'])) {
            $filters['is_active'] = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        if (isset($filters['include_archived'])) {
            $filters['include_archived'] = filter_var($filters['include_archived'], FILTER_VALIDATE_BOOLEAN);
        }

        return $filters;
    }

    /**
     * Get per-page value for pagination.
     */
    public function perPage(): int
    {
        return $this->input('per_page', 5);
    }
}
