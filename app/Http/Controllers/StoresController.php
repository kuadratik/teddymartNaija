<?php

namespace App\Http\Controllers;

use App\Actions\RecordCategoryInteractionsAction;
use App\Http\Requests\Store\CreateStoreRequest;
use App\Http\Requests\Store\UpdateStoreRequest;
use App\Jobs\RecordCategoryInteractions;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class StoresController extends Controller
{
    /**
     * Display a store metrics 
     */
    public function getUserStoreMetrics(Request $request)
    {
        $userStoreListingsCount = $request->user()->store->listings()->byType($request->listingType)->count();
        return $this->success(["totalListingsCount" => $userStoreListingsCount]);
    }

    /**
     *  Get stores
     */
    public function getStores(Request $request)
    {
        $stores = Store::query()->byListingType($request->listingType)->when(
            $request->search,
            fn ($query) => $query->search($request->search)
        )->when(
            $request->category,
            fn ($query) => $query->byCategory($request->category)
        )->get();

        RecordCategoryInteractions::dispatch($request->search, $request->header('interactUid'));
        return $this->success($stores);
    }

    /**
     *  Get recommended stores
     */
    public function getRecommendedStores(Request $request)
    {
        $stores = Store::query()->recommended()->inRandomOrder()->paginate();

        return $this->success($stores);
    }

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
     * Display the specified store listing.
     */
    public function showStoreListing(Store $store, Request $request)
    {
        $storeListing = $store->load(['listings' => function ($query) use ($request) {
            $query->where('type', $request->listingType);
        }]);

        return $this->success($storeListing);
    }

    /**
     * Update the specified store.
     */
    public function update(UpdateStoreRequest $request, Store $userStore)
    {
        $userStore->update($request->storeAttributes());
        return $this->success();
    }
}
