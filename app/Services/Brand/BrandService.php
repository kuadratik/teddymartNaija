<?php

namespace App\Services\Brand;

use App\Models\Brand;
use App\Models\BrandCategory;
use Illuminate\Support\Facades\DB;

class BrandService
{
    /**
     * Create a new brand
     */
    public function createBrand(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Brand::create([
                'name' => $data['name'],
                'brand_category_id' => $data['brand_category_id'],
                'description' => $data['description'] ?? null,
                'logo_url' => $data['logo_url'] ?? null,
                'source_url' => $data['source'] ?? null,
                'target_url' => $data['target_url'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);
        });
    }

    public function getAllBrands(array $filters = [], int $perPage = 5)
    {
        return Brand::with('category')
            ->when(!empty($filters['search']), function ($query) use ($filters) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('description', 'like', '%' . $filters['search'] . '%');
                });
            })
            ->when(!empty($filters['category_id']), function ($query) use ($filters) {
                $query->where('brand_category_id', $filters['category_id']);
            })
            ->when(array_key_exists('is_active', $filters), function ($query) use ($filters) {
                $query->where('is_active', $filters['is_active']);
            })
            ->when(!isset($filters['include_archived']) || !$filters['include_archived'], function ($query) {
                $query->where('is_archived', false);
            })
            ->latest()
            ->paginate($perPage);
    }


    public function updateBrand(int $id, array $data)
    {
        $brand = Brand::findOrFail($id);
        $brand->update($data);
        return $brand->fresh('category');
    }

    public function deleteBrand(int $id): bool
    {
        $brand = Brand::find($id);

        if (! $brand) {
            return false;
        }

        return (bool) $brand->delete();
    }

    public function getBrandById(int $id)
    {
        return Brand::with('category')->findOrFail($id);
    }

    /**
     * Create or update a brand category
     */
    public function createCategory(array $data)
    {
        return BrandCategory::create([
            'name' => $data['name'],
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Get all categories
     */
    public function getAllCategories()
    {
        return BrandCategory::where('is_active', true)->latest()->get();
    }

    public function archiveBrand(int $id): Brand
    {
        $brand = Brand::findOrFail($id);
        $brand->update(['is_archived' => true]);
        return $brand;
    }

    public function unarchiveBrand(int $id): Brand
    {
        $brand = Brand::findOrFail($id);
        $brand->update(['is_archived' => false]);
        return $brand;
    }
}
