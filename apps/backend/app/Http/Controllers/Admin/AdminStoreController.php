<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\StoreActivationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateNavigationRequest;
use App\Http\Requests\Admin\StoreActivationRequest;
use App\Models\Navigation;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

class AdminStoreController extends Controller
{
    public function deactivate(Store $store)
    {
        $store->update(['active' => false]);

        return $this->success(['message' => 'Store deactivated successfully']);
    }

    public function activation(StoreActivationRequest $request, StoreActivationAction $action)
    {
        $action->handle($request->validated());
        return $this->success();
    }

    public function navigations(Request $request)
    {
        $navs = Navigation::when($request->filled('type'))->byType($request->type)
            ->oldest('ordering')->get();
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

    public function vendors(Request $request)
    {
        $vendors = User::adminVendors()->paginate();
        return $this->success($vendors);
    }
}