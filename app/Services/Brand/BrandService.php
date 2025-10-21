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
            $brand = Brand::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'logo_url' => $data['logo_url'] ?? null,
                'source_url' => $data['source_url'] ?? null,
                'target_url' => $data['target_url'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            $brand->categories()->sync($data['category_ids']);

            return $brand->load('categories');
        });
    }

    public function getAllBrands(array $filters = [], int $perPage = 5)
    {
        return Brand::with('categories')
            ->when(!empty($filters['search']), function ($query) use ($filters) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', '%' . $filters['search'] . '%')
                        ->orWhere('description', 'like', '%' . $filters['search'] . '%');
                });
            })
            ->when(!empty($filters['category_id']), function ($query) use ($filters) {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->where('brand_categories.id', $filters['category_id']);
            });
            })
            ->when(array_key_exists('is_active', $filters), function ($query) use ($filters) {
                $query->where('is_active', $filters['is_active']);
            })
            ->when(!isset($filters['include_archived']) || !$filters['include_archived'], function ($query) {
                $query->where('is_archived', false);
            })
            ->latest('updated_at')
            ->paginate($perPage);
    }


    public function updateBrand(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $brand = Brand::findOrFail($id);

            $categoryIds = $data['category_ids'] ?? null;
            unset($data['category_ids']);

            $brand->update($data);

            if ($categoryIds) {
                $brand->categories()->sync($categoryIds);
            }

            return $brand->fresh('categories');
        });
    }

    public function deleteBrand(int $id): bool
    {
        $brand = Brand::find($id);

        if (! $brand) {
            return false;
        }

        return (bool) $brand->delete();
    }

    public function getBrandById(int $id, bool $activeOnly = false)
    {
        $query = Brand::with('categories');
        
        if ($activeOnly) {
            $query->where('is_active', true)->where('is_archived', false);
        }
        
        return $query->findOrFail($id);
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
        return BrandCategory::where('is_active', true)->latest('updated_at')->get();
    }

    /**
     * Get active brands for public API
     */
    public function getActiveBrands()
    {
        return Brand::with('categories')
            ->where('is_active', true)
            ->where('is_archived', false)
            ->latest('updated_at')
            ->get();
    }

    /**
     * Get active categories for public API
     */
    public function getActiveBrandCategories()
    {
        return BrandCategory::where('is_active', true)
            ->latest('updated_at')
            ->get();
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
