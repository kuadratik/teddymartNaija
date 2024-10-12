<?php

namespace App\Services;

use App\Enums\ListingType;
use App\Http\Requests\Cart\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Listing;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Support\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Resources\OrderResource;



class CartService
{
    /**
     * Get detailed cart information including total items and product details
     */
    public function getCartDetails(Request $request)
    {
        $cart = $this->getCart($request)->load(['products']);
        $totalCartPrice = $cart->products->sum(function ($product) {
            return $product->pivot->quantity * $product->price;
        });
        $cartDetails = [
            'cart_id' => $cart->id,
            'total_items' => $cart->products->sum('pivot.quantity'),
            'total_quantity' => $cart->products->count(),
            'total_price' => $totalCartPrice,
            'products' => $cart->products->map(function ($product) {
                return [
                    'listing_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $product->pivot->quantity,
                    'currency_code' => $product->currency,
                    'total_price' => $product->pivot->quantity * $product->price,
                    'images' => $product->images
                ];
            })
        ];

        return $cartDetails;
    }

    /**
     * Add a product to the cart if it's a valid product type.
     */
    public function addToCart(Request $request, Listing $product): Cart
    {
        if ($product->type !== ListingType::PRODUCT->value) {
            return Utils::validateResp(['error' => ['Product not found']]);
        }

        $cart = $this->getCart($request);

        $cart->products()->syncWithoutDetaching([
            $product->id => ['quantity' => DB::raw('COALESCE(quantity, 0) + 1')]
        ]);

        return $cart->fresh(['products']);
    }

    /**
     * Edit the quantity of a specific product in the cart.
     */
    public function editCartQuantity(Request $request, Listing $product): Cart
    {
        $cart = $this->getCart($request);

        if ($request->quantity <= 0) {
            $cart->products()->detach($product->id);
            return $cart->fresh(['products']);
        }

        $cart->products()->syncWithoutDetaching([
            $product->id => ['quantity' => $request->quantity]
        ]);

        return $cart->fresh(['products']);
    }

    /**
     * Delete a product from the cart.
     */
    public function removeProductFromCart(Request $request, Listing $product): Cart|array
    {
        $cart = $this->getCart($request);

        abort_if(!$cart->products->contains($product), 404, 'Product not found in the cart');

        $cart->products()->detach($product->id);

        if ($cart->products()->count() === 0) {
            $this->deleteCartById($cart->id);
            return [];
        }

        return $cart->fresh(['products']);
    }

    /**
     * Clear the cart by removing all products.
     */
    public function clearCart(Request $request): array
    {
        $cart = $this->getCart($request);
        $cart->products()->detach();
        $this->deleteCartById($cart->id);
        return [];
    }


    /**
     * Get the user's cart based on the provided request.
     */
    private function getCart(Request $request): Cart
    {
        $sessionUid = $request->header('session-uid');
        $user = $request->user();

        if (!$user) {
            return Cart::firstOrCreate(['session_uid' => $sessionUid]);
        }

        $userCart = Cart::firstOrCreate(['user_id' => $user->id]);
        $guestCart = Cart::where('session_uid', $sessionUid)->whereNull('user_id')->first();

        if ($guestCart) {
            $this->mergeGuestCart($userCart->load('products'), $guestCart->load('products'));
            $guestCart->delete();
        }

        $userCart->session_uid = $sessionUid;
        $userCart->save();

        return $userCart;
    }

    /**
     * Merge products from a guest cart into the user's cart without detaching existing products.
     */
    private function mergeGuestCart(Cart $userCart, Cart $guestCart): void
    {
        foreach ($guestCart->products as $product) {
            $userCart->products()->syncWithoutDetaching([
                $product->id => [
                    'quantity' => DB::raw("COALESCE(quantity, 0) + {$product->pivot->quantity}")
                ]
            ]);
        }
    }

    /**
     * delete a cart by id
     */
    private function deleteCartById(int $cartId): void
    {
        Cart::where('id', $cartId)->delete();
    }

    /**
     * Store users order and order details
     */

    public function createCartOrder(StoreOrderRequest $request, Cart $cart)
    {
        DB::transaction(function () use ($request, $cart) {
            $cart = Cart::find($cart->id);

            $cartItems = $cart->products()
                ->with('store')
                ->get()
                ->groupBy('store_id');

            foreach ($cartItems as $storeId => $items) {
                $totalAmount = $items->sum(function ($item) {
                    return $item->pivot->quantity * $item->price;
                });

                $customer = auth()->user();

                $order = Order::create([
                    'store_id' => $storeId,
                    'user_id' => $customer->id,
                    'order_number' => Str::uuid()->toString(),
                    'first_name' => $request->validated('first_name'),
                    'last_name' => $request->validated('last_name'),
                    'email' => $request->validated('email'),
                    'phone' => $request->validated('phone'),
                    'total_amount' => $totalAmount,
                    'type' => ListingType::PRODUCT->value,
                ]);

                $order->shippingAddress()->attach($request->validated('shipping_address_id'));

                foreach ($items as $item) {
                    OrderDetail::create([
                        'order_id' => $order->id,
                        'listing_id' => $item->id,
                        'listing_name' => $item->name,
                        'listing_price' => $item->price,
                    ]);
                }
            }

            $cart->products()->detach();
        });
    }

    /**
     * Get orders for a specific user, with optional status filtering.
     */
    public function getUserOrders(Request $request)
    {
        $user = $request->user();
        $status = $request->query('order_status');

        $orders = Order::with(['orderDetails', 'shippingAddress'])
            ->where('user_id', $user->id)
            ->where('type', ListingType::PRODUCT->value)
            ->when($status, fn($query) => $query->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->get();

        return OrderResource::collection($orders);
    }
}
