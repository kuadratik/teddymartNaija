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
use App\Notifications\SendServiceOrderToVendorNotificaion;
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
            $product = Listing::where('id', $productId)
                ->where('type', ListingType::PRODUCT)
                ->with('store')
                ->first();

            if (!$product) {
                return Utils::validateResp(['error' => ['Product not found']]);
            }

            $uid = $request->header('Clip-Uid');
            $storeId = $product->store->id;
            $customerId = auth()->id();

            $existingClip = Clip::where('store_id', $storeId)
                ->where(function ($query) use ($uid, $customerId) {
                    $query->where('uid', $uid)
                        ->orWhere(function ($q) use ($customerId) {
                            $q->whereNotNull('user_id')
                                ->where('user_id', $customerId);
                        });
                })
                ->first();
            if ($existingClip && $existingClip->products()->where('listing_id', $productId)->exists()) {
                return Utils::validateResp(['error' => ['Product already clipped.']]);
            }

            $clip = Clip::updateOrCreate(
                ['store_id' => $storeId, 'uid' => $uid],
                ['user_id' => $customerId, 'uid' => $uid]
            );

            $clip->products()->attach($product->id);

            return $clip;
        });
    }


    /**
     * Get  all clips
     */
    public function getClips(): array
    {
        $clipUid = request()->header('Clip-Uid');
        $clips = Clip::query()
            ->where('uid', $clipUid)
            ->with('products')
            ->get();

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
                'user_id' => auth()->id(),
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'type' => ListingType::PRODUCT->value,
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
     * save customer service enquiry
     */
    public function storeServiceEnquiry(Listing $service)
    {
        return DB::transaction(
            function () use ($service) {
                $user = auth()->user();
                $order = Order::create([
                    'store_id' => $service->store_id,
                    'user_id' => auth()->id(),
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'type' => ListingType::SERVICE->value,
                    'email' => $user->email,
                    'order_number' => Str::uuid()->toString(),
                    'total_amount' => $service->price,
                ]);

                OrderDetail::create([
                    'order_id' => $order->id,
                    'listing_id' => $service->id,
                    'listing_price' => $service->price,
                    'listing_name' => $service->name,
                ]);

                $this->sendOrderToVendor($order);

                return $order->load('orderDetails');
            }
        );
    }


    /**
     * Send order to vendor
     */
    public function sendOrderToVendor(Order $order)
    {
        if ($order->type == ListingType::PRODUCT->value) {
            $order->store->user->notify(new SendOrderToVendorNotificaion($order));
            Clip::where('store_id',  $order->store_id)->where('order_id', $order->id)->delete();
            return true;
        } elseif ($order->type == ListingType::SERVICE->value) {
            $order->store->user->notify(new SendServiceOrderToVendorNotificaion($order->load(['orderDetails', 'store', 'customer'])));
            return true;
        }
    }


    /**
     * Get store customer count from orders
     */
    public function getStoreCustomerCount(Store $store)
    {
        $store_count = Order::where('store_id', $store->id)->distinct('user_id')->count('user_id');
        return ['customer_count' => $store_count];
    }
}
