<?php

namespace App\Http\Controllers;

use App\Actions\FetchStoresAlphaNumericallyAction;
use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Http\Requests\Cart\UpdateOrderRequest;
use App\Http\Requests\Store\CreateStoreRequest;
use App\Http\Requests\Store\UpdateStoreRequest;
use App\Jobs\RecordCategoryInteractions;
use App\Models\Order;
use App\Models\Store;
use App\Services\Auth\UserService;
use App\Services\Store\MetricService;
use App\Services\Store\StoreService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoresController extends Controller
{
    public function __construct(Request $request, protected StoreService $storeService)
    {
        //
    }

    /**
     * Display store metrics including listings count and customer count
     */
    public function getUserStoreMetrics(Request $request, UserService $userService, Store $userStore)
    {
        abort_if($userStore->user_id !== $request->user()->id, 402, 'Unauthorized');

        $userStoreListingsCount = $userStore->listings()->byType($request->listingType)->count();
        $customersCount = $userService->getStoreCustomerCount($userStore);

        return $this->success(['totalListingsCount' => $userStoreListingsCount, 'totalCustomerCount' => $customersCount]);
    }

    /**
     * Display detailed store metrics
     */
    public function getStoreOverallMetrics(Request $request, Store $userStore)
    {
        abort_if($userStore->user_id !== $request->user()->id, 402, 'Unauthorized');

        $metrics = (new MetricService($userStore))->storeMetrics();

        return $this->success($metrics);
    }

    /**
     * Get stores with optional currency filter
     */
    public function getStores(Request $request)
    {
        $currency = $request->header('currency', 'USD');

        $stores = Store::query()
            ->where('type', $request->listingType)
            ->when($request->sortType === 'alphanumeric', fn ($query) => $query->orderBy('name', 'asc'))
            ->when($request->search, fn ($query) => $query->search($request->search))
            ->when($request->category, fn ($query) => $query->byCategory($request->category))
            ->where('currency', $currency)
            ->paginate(20);

        RecordCategoryInteractions::dispatch($request->search, $request->header('interactUid'));

        return $this->success($stores);
    }

    /**
     *  Get recommended stores with optional country filter
     */
    public function getRecommendedStores(Request $request)
    {
        $currency = $request->header('currency', 'USD');

        $stores = Store::query()
            ->recommended()
            ->where('currency', $currency)
            ->inRandomOrder()
            ->paginate();

        return $this->success($stores);
    }

    /**
     *  Get popular recommended stores with optional country filter
     */
    public function getPopularRecommendedStores(Request $request)
    {
        $country = $request->header('country', 'United States');

        $stores = Store::query()
            ->popularRecommended()
            ->whereHas('country', function ($query) use ($country) {
                $query->where('name', $country);
            })
            ->inRandomOrder()
            ->paginate();

        return $this->success($stores);
    }

    /**
     * Get popular stores based on views with optional country filter
     */
    public function getPopularStores(Request $request)
    {
        $country = $request->header('country', 'United States');

        $store = Store::query()
            ->popular()
            ->whereHas('country', function ($query) use ($country) {
                $query->where('name', $country);
            })
            ->orderBy('views_count', 'desc')
            ->get();

        return $this->success($store);
    }

    /**
     *  Get store in alphanumerical order
     */
    public function getStoresAlphaNumerically(FetchStoresAlphaNumericallyAction $fetchStoreAction)
    {
        $stores = $fetchStoreAction->keyedStoreList();

        return $this->success($stores);
    }

    /**
     *  Get store ratings
     */
    public function getStoreRatings(Request $request, Store $userStore)
    {
        $search = $request->product;

        $storeRatings = $userStore->ratings()->whereHas(
            'listing',
            function ($query) use ($search) {
                $query->where('name', "like", "%{$search}%");
            }
        )->with(
            'user:id,first_name,last_name,email',
            'listing:id,name'
        )->paginate(20);

        return $this->success($storeRatings);
    }

    /**
     *  Add store views count
     */
    public function addStoreViewsCount(Request $request, Store $store)
    {
        $store->increment('views_count');

        return $this->success();
    }

    /**
     * Creates a store based on the provided request.
     */
    public function create(CreateStoreRequest $request)
    {
        $user = $request->user();
        $store = null;

        DB::transaction(function () use ($request, $user, &$store) {
            $store = Store::create($request->storeAttributes());
            $user->update([
                'offers_service' => $request->offers_service,
                'offers_product' => $request->offers_product,
                'has_store' => true,
            ]);
        });

        return $this->success(['store' => $store]);
    }

    /**
     * Display the specified store.
     */
    public function showUserStore(Request $request)
    {
        $user = $request->user();
        $store = $user->store()
            ->when($request->hasHeader('currency'), function ($query) use ($request) {
                $query->where('currency', $request->header('currency'));
            })
            ->get();

        return $this->success($store);
    }

    /**
     * Display the specified store listing.
     */
    public function showStoreListing(Store $store, Request $request)
    {
        $storeListing = $store->load(['listings' => function ($query) use ($request) {
            $query->where('type', $request->listingType)
                ->with('ratings');
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

    /**
     * Show vendor Order history
     */
    public function getStoreOrderHistory(Request $request, Store $store)
    {
        $orders = $this->storeService->getAllStoreOrders($request, $store);
        return $this->success($orders);
    }

    /**
     * Update the store order status.
     */
    public function updateStoreOrderStatus(UpdateOrderRequest $request, Store $store, Order $order)
    {
        abort_if($store->id !== $order->store_id, 403, 'Unauthorized');
        $order->status = $request->validated('status');
        $order->save();

        if (
            $order->wasChanged() &&
            $order->status === OrderStatusEnum::SHIPPED->value
        ) {
            // Notification::route('mail', $order->customer()->email)
            //     ->notify(new OrderShippedNotification($order));
        }

        return $this->success();
    }


    /**
     * Show a single store order.
     */
    public function showStoreOrder(Store $store, Order $order)
    {
        abort_if($store->id !== $order->store_id, 403, 'Unauthorized');
        $order->load(['orderDetails', 'store', 'customer', 'payments', 'shippingAddress', 'shippingMethod']);
        return $this->success($order);
    }
}
