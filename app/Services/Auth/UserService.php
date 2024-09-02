<?php

namespace App\Services\Auth;

use App\Enums\ListingType;
use App\Http\Requests\User\StoreClipOrderRequest;
use App\Models\User;
use App\Support\Utils;
use App\Http\Resources\ClipResource;
use App\Models\Clip;
use Illuminate\Support\Str;
use App\Models\Listing;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Store;
use App\Notifications\SendOrderToVendorNotificaion;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Update user's password.
     */
    public function updateUserPassword(array $request): bool
    {
        $user = User::find(auth()->user()->id);

        if (!password_verify($request['old_password'], $user->password)) {
            return Utils::validateResp(['new_password' => ['The provided old password is incorrect.']]);
        }

        $user->update(['password' => Hash::make($request['new_password'])]);
        return true;
    }

    /**
     * Add product to clip.
     */
    public function addToClip(Request $request, int $productId)
    {
        return DB::transaction(function () use ($request, $productId) {
            $product = Listing::where('id', $productId)->where('type', ListingType::PRODUCT)->with('store')->first();

            if (!$product) {
                return Utils::validateResp(['error' => ['Product not found']]);
            }

            $uid = auth()->user()->clipper_uid ?? $request->header('Clip-Uid');
            $storeId = $product->store->id;
            $customerId = auth()->id();

            $clip = Clip::updateOrCreate(
                ['store_id' => $storeId, 'uid' => $uid],
                ['store_id' => $storeId, 'user_id' => $customerId, 'uid' => $uid]
            );

            $result = $clip->addProduct($product);

            if (!$result) {
                return Utils::validateResp(['error' => ['Product already clipped.']]);
            }

            return $clip;
        });
    }

    /**
     * Get all clips for a user.
     */
    public function getClips()
    {
        $customerId = auth()->id();
        $clipUid = request()->header('Clip-Uid');
        $authClipperUid = optional(auth()->user())->clipper_uid;

        $clips = Clip::query()
            ->when($customerId, fn($query) => $query->where('user_id', $customerId))
            ->when(!$customerId && $clipUid, fn($query) => $query->where('uid', $clipUid))
            ->orWhere(fn($query) => $query->where('uid', $authClipperUid))
            ->with('products')
            ->get()
            ->unique('id');

        $totalProductCount = $clips->sum(fn($clip) => $clip->products->count());

        return [
            'total_product_count' => $totalProductCount,
            'clips' => ClipResource::collection($clips),
        ];
    }

    /**
     * Get a clip by ID with product details.
     */
    public function getClipItems(Clip $clip): array
    {
        $customerId = auth()->id();
        $clipUid = request()->header('Clip-Uid');

        $clipData = Clip::when($customerId, fn($query) => $query->where('user_id', $customerId))
            ->when(!$customerId && $clipUid, fn($query) => $query->where('uid', $clipUid))
            ->where('id', $clip->id)
            ->with('products')
            ->firstOrFail();

        return $clipData->products->map(fn($product) => [
            'name' => $product->name,
            'slug' =>  $product->slug,
            'image' => @$product->images[0],
            'price' => $product->price,
        ])->all();
    }


    /**
     * Store users order and order details
     */
    public function storeClipOrder(StoreClipOrderRequest $request, Clip $clip)
    {

        return DB::transaction(function () use ($request, $clip) {
            $order = Order::create([
                'store_id' => $clip->store_id,
                'user_id' => auth()->user()->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'order_number' => Str::uuid()->toString(),
                'total_amount' => $clip->products->sum('price'),
            ]);

            $orderDetails = $clip->products->map(function ($product) use ($order) {
                return [
                    'order_id' => $order->id,
                    'listing_id' => $product->id,
                    'listing_price' => $product->price,
                    'listing_name' => $product->name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            });

            OrderDetail::insert($orderDetails->all());
            $clip->setAddOrder($order->id);
            return $order->load('orderDetails');
        });
    }


    /**
     * Send order to vendor
     */
    public function sendOrderToVendor(Order $order)
    {
        $order->store->user->notify(new SendOrderToVendorNotificaion($order));
        Clip::where('store_id',  $order->store_id)->where('order_id', $order->id)->delete();
        return true;
    }


    /**
     * get store customer count from orders
     */
    public function getStoreCustomerCount(Store $store)
    {
        $store_count = Order::where('store_id', $store->id)->distinct('user_id')->count('user_id');
        return ['customer_count' => $store_count];
    }
}
