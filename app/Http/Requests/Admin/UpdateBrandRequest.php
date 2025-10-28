<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Support\Utils;
use Illuminate\Validation\Rule;
use App\Rules\ValidSlugInUrl;

class UpdateBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare input before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $brandId = $this->route('brand')->id ?? null;
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'category_ids' => 'sometimes|required|array|min:1',
            'category_ids.*' => 'exists:brand_categories,id',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'source_url' => [
                'nullable',
                'url',
                Rule::unique('brands', 'source_url')->ignore($brandId),
                new ValidSlugInUrl()
            ],
            'target_url' => 'nullable|url',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Customize error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Brand name is required.',
            'category_ids.required' => 'At least one category is required.',
            'category_ids.*.exists' => 'Invalid brand category selected.',
            'source_url.unique' => 'Slug already exists',
        ];
    }

    /**
     * Move logo from temp to permanent storage (if updated).
     */
    public function logoPath(): ?string
    {
        $logo = $this->validated('logo_url');

        if (empty($logo)) {
            return null;
        }

        return Utils::moveToPermanentPath([$logo], 'brands')[0] ?? $logo;
    }

    /**
     * Format the attributes for brand update.
     */
    public function brandAttributes(): array
    {
        $attributes = collect($this->validated())->only([
            'name',
            'category_ids',
            'description',
            'source_url',
            'target_url',
            'is_active',
        ]);

        if ($this->filled('logo_url')) {
            $attributes['logo_url'] = $this->logoPath();
        }

        return $attributes->toArray();
    }
}
