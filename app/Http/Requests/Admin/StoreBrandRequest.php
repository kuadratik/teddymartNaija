<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Support\Utils;
use App\Models\Brand;
use Illuminate\Validation\Rule;
use App\Rules\ValidSlugInUrl;

class StoreBrandRequest extends FormRequest
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
     * Useful if you want to sanitize or structure inputs.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:brand_categories,id',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'source_url' => [
                'nullable',
                'url',
                'unique:brands,source_url',
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
     * Move logo from temp to permanent storage.
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
     * Format the attributes for brand creation.
     */
    public function brandAttributes(): array
    {
        return [
            'name' => $this->validated('name'),
            'category_ids' => $this->validated('category_ids'),
            'description' => $this->validated('description'),
            'logo_url' => $this->logoPath(),
            'source_url' => $this->validated('source_url'),
            'target_url' => $this->validated('target_url'),
            'is_active' => $this->validated('is_active', true),
        ];
    }
}
