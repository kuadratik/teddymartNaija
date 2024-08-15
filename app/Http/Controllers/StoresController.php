<?php

namespace App\Http\Controllers;

use App\Http\Requests\Store\CreateStoreRequest;
use App\Models\Store;
use Illuminate\Http\Request;

class StoresController extends Controller
{
    public function create(CreateStoreRequest $request)
    {
        Store::create($request->storeAttributes());
        return $this->success();
    }

    public function show(Store $store)
    {
        return $this->success($store);
    }

    
}
