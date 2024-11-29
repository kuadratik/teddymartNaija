<?php

namespace App\Services\Store;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Models\OrderDetail;
use App\Models\Store;
use Illuminate\Support\Facades\DB;

class MetricService
{
    /**
     * Create a new class instance.
     */
    public function __construct(private Store $userStore)
    {
    }

    public function storeMetrics()
    {
        $counts = collect([
            'totalRevenue' => $this->userStore->orders()->where('status' , OrderStatusEnum::PAID->value)->sum('total_amount'),
            'payoutAccrued' => '',
            'orderFulfilled' => $this->userStore->orders()->where('status' , OrderStatusEnum::PAID->value)->count(),
            'myCustomers' => $this->userStore->orders()->distinct('user_id')->count('user_id'),
            'productListed' => $this->userStore->listings()->where('type', ListingType::PRODUCT->value)->count(),
        ]);

        $lists = collect([
            'bestSellingProducts' => $this->bestSellingProducts(),
            'recentOrders' => $this->recentOrders(),
            'productReviews' => $this->productReviews()
        ]);

        $storeMetrics = collect([
            'counts' => $counts,
            'list' =>   $lists
        ])->toArray();

        return $storeMetrics;
    }

    public function bestSellingProducts()
    {
        $orderIds = $this->userStore->orders()->pluck('id');

        $mostOrderProductIds = OrderDetail::whereIn('order_id', $orderIds)
            ->select('listing_id', DB::raw('count(*) as order_count'))
            ->groupBy('listing_id')->orderBy('order_count', 'desc')->limit(5)
            ->pluck('listing_id');

        return $this->userStore->listings()->where('type', ListingType::PRODUCT->value)
            ->whereIn('id', $mostOrderProductIds)->limit(5)->get();
    }

    public function recentOrders()
    {
        return $this->userStore->orders()->with('customer')->latest()->limit(5)->get();
    }

    public function productReviews()
    {
        return $this->userStore->ratings()->with('user')->latest()->limit(12)->get();
    }
}
