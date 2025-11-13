<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateNavigationRequest;
use App\Models\Navigation;
use App\Models\Store;

class AdminStoreController extends Controller
{
    public function deactivate(Store $store)
    {
        $store->update(['active' => false]);
        
        return $this->success(['message' => 'Store deactivated successfully']);
    }

    public function activate(Store $store)
    {
        $store->update(['active' => true]);
        
        return $this->success(['message' => 'Store activated successfully']);
    }

    public function navigations()
    {
        $navs = Navigation::oldest('ordering')->get();
        return $this->success($navs);
    }

    public function createMenu(CreateNavigationRequest $request)
    {
        $menu = Navigation::create($request->validated());
        return $this->success($menu);
    }

    public function updateMenu(CreateNavigationRequest $request, Navigation $navigation)
    {
        $navigation->update($request->validated());
        return $this->success($navigation);
    }

    public function deleteMenu(Navigation $navigation)
    {
        $navigation->delete();
        return $this->success();
    }
}