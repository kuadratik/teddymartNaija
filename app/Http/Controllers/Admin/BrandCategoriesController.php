<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandCategoryRequest;
use Illuminate\Http\Request;
use App\Services\Brand\BrandService;

class BrandCategoriesController extends Controller
{

    public function __construct(protected BrandService $brandService) {}

    public function index()
    {
        $categories = $this->brandService->getAllCategories();
        return $this->success($categories);
    }

    public function store(StoreBrandCategoryRequest $request)
    {
        $category = $this->brandService->createCategory($request->validated());

        return $this->success($category, 'Category created successfully');
    }
}
