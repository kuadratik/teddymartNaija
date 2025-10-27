<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FilterBrandsRequest;
use App\Http\Requests\Admin\SlugRecommendationRequest;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\Brand\BrandService;

class BrandController extends Controller
{


    public function __construct(protected BrandService $brandService) {}

    public function index(FilterBrandsRequest $request)
    {
        $brands = $this->brandService->getAllBrands(
            $request->filters(),
            $request->perPage()
        );

        return $this->success($brands);
    }

    public function store(StoreBrandRequest $request)
    {
        $brand = $this->brandService->createBrand($request->brandAttributes());

        return $this->success($brand, 'Brand created successfully');
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $brand = $this->brandService->updateBrand($brand->id, $request->brandAttributes());
        return $this->success($brand, 'Brand updated successfully');
    }

    public function show(Brand $brand)
    {
        $brand = $this->brandService->getBrandById($brand->id);
        return $this->success($brand);
    }

    public function archive(Brand $brand)
    {
        $archivedBrand = $this->brandService->archiveBrand($brand->id);

        return $this->success($archivedBrand, 'Brand archived successfully');
    }

    public function unarchive(int $id)
    {
        $brand = $this->brandService->unarchiveBrand($id);
        return $this->success($brand, 'Brand unarchived successfully');
    }


    public function destroy(Brand $brand)
    {
        $deleted = $this->brandService->deleteBrand($brand->id);
        return $this->success(message: 'Brand deleted successfully');
    }

    public function slugRecommendation(SlugRecommendationRequest $request)
    {
        $slug = $this->brandService->generateSlug($request->validated('name'));

        return $this->success(['slug' => $slug]);
    }
}
