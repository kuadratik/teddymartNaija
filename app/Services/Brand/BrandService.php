<?php

namespace App\Services\Brand;

use App\Models\Brand;
use App\Models\BrandCategory;
use App\Models\BrandHistory;
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
            ->when(!empty($filters['category_ids']), function ($query) use ($filters) {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->whereIn('brand_categories.id', $filters['category_ids']);
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
            $originalBrand = $brand->getOriginal();

            $categoryIds = $data['category_ids'] ?? null;
            unset($data['category_ids']);

            $brand->update($data);

            if ($this->hasSignificantChanges($originalBrand, $brand->toArray())) {
                BrandHistory::create([
                    'brand_id' => $brand->id,
                    'admin_id' => auth()->user()->id ?? null,
                    'brand_name' => $brand->name,
                    'admin_name' => auth()->user()->first_name ?? 'System',
                    'old_slug' => $this->extractSlugFromUrl($originalBrand['source_url']),
                    'old_target_url' => $originalBrand['target_url'],
                    'old_source_url' => $originalBrand['source_url'],
                    'new_slug' => $this->extractSlugFromUrl($brand->source_url),
                    'new_target_url' => $brand->target_url,
                    'new_source_url' => $brand->source_url,
                ]);
            }

            if ($categoryIds) {
                $brand->categories()->sync($categoryIds);
            }

            return $brand->fresh('categories');
        });
    }

    private function hasSignificantChanges(array $original, array $updated): bool
    {
        $trackableFields = ['name', 'target_url', 'source_url'];

        foreach ($trackableFields as $field) {
            if (($original[$field] ?? null) !== ($updated[$field] ?? null)) {
                return true;
            }
        }

        return false;
    }

    private function extractSlugFromUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);

        if (!$path) {
            return null;
        }

        $segments = explode('/', trim($path, '/'));
        return end($segments) ?: null;
    }

    public function getBrandHistory(?string $search = null)
    {
        return BrandHistory::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('brand_name', 'like', "%{$search}%")
                        ->orWhere('admin_name', 'like', "%{$search}%")
                        ->orWhere('old_slug', 'like', "%{$search}%")
                        ->orWhere('old_target_url', 'like', "%{$search}%")
                        ->orWhere('old_source_url', 'like', "%{$search}%")
                        ->orWhere('new_slug', 'like', "%{$search}%")
                        ->orWhere('new_target_url', 'like', "%{$search}%")
                        ->orWhere('new_source_url', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20);
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

    public function generateSlug(string $name): string
    {
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
        $slug = $baseSlug;
        $counter = 1;

        while (Brand::where('source_url', 'like', '%/' . $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    public function findTargetBySlug(string $slug): ?string
    {
        $brand = Brand::where('source_url', 'like', '%/' . $slug)
            ->orWhere('source_url', $slug)
            ->where('is_active', true)
            ->where('is_archived', false)
            ->first();

        if ($brand?->target_url) {
            return $brand->target_url;
        }

        // Check brand history for old slug match
        $history = BrandHistory::where('old_slug', $slug)
            ->latest()
            ->first();

        if ($history?->new_target_url) {
            return $history->new_target_url;
        }

        return null;
    }
}
