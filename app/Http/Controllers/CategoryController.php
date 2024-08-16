<?php

namespace App\Http\Controllers;

use App\Enums\ListingType;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     *get all product category
     */
    public function getProductCategory()
    {
        $product_category = Category::where('type', ListingType::PRODUCT)->get();
        return $this->success($product_category);
    }

    /**
     * get all service category
     *
     */
    public function getServiceCategory()
    {
        $service_category = Category::where('type', ListingType::SERVICE)->get();
        return $this->success($service_category);
    }

    /**
     * Get all categories
     */
    public function getAllCategory()
    {
        $categories = Category::all();
        return $this->success($categories);
    }
}
