<?php

namespace App\Http\Controllers;

use App\Http\Requests\Store\CreateStoreRequest;
use App\Http\Requests\Store\UpdateStoreRequest;
use App\Models\Store;
use App\Support\Utils;
use App\Utils\FileUploader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class StoresController extends Controller
{
    /**
     * Creates a store based on the provided request.
     */
    public function create(CreateStoreRequest $request)
    {
        $user = $request->user();

        if (Store::query()->byUser($user->id)->exists()) {
            return $this->failure('You can not have more than one store!', 403);
        }

        DB::transaction(function () use ($request, $user) {
            Store::create($request->storeAttributes());
            $user->update([
                'offers_service' => $request->offers_service,
                'offers_product' => $request->offers_product,
                'has_store' => true
            ]);
        });

        return $this->success();
    }

    /**
     * Display the specified store.
     */
    public function showUserStore(Request $request)
    {
        return $this->success($request->user()->store);
    }

    /**
     * Update the specified store.
     */
    public function update(UpdateStoreRequest $request, Store $userStore)
    {
        $userStore->update($request->validated());
        return $this->success();
    }


    /**
     * upload temp file to spaces
     */
    public function uploadTempFile(Request $request)
    {
        $path = Utils::uploadTemporary($request->file('images'));
        return $this->success($path);
    }
}
