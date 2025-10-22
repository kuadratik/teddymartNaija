<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\FilterBrandsRequest;
use App\Models\Brand;
use App\Services\Brand\BrandService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function __construct(protected BrandService $brandService) {}

    public function index(FilterBrandsRequest $request): JsonResponse
    {
        $filters = array_merge($request->only(['search']), [
            'is_active' => true,
            'include_archived' => false,
            'category_ids' => $request->input('category_ids', []),
        ]);

        $brands = $this->brandService->getAllBrands($filters, $request->query('per_page', 15));

        return $this->success($brands);
    }


    public function show(Brand $brand): JsonResponse
    {
        $brand = $this->brandService->getBrandById($brand->id, true);

        return $this->success($brand);
    }

    public function categories(): JsonResponse
    {
        $categories = $this->brandService->getActiveBrandCategories();

        return $this->success($categories);
    }
}
