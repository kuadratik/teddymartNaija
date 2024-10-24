<?php

namespace App\Services;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Enums\PaymentGatewayEnum;
use App\Enums\PaymentTransactionTypeEnum;
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
use App\Models\Payment;
use App\Services\PaymentGateways\PaymentService;
use Maatwebsite\Excel\Concerns\ToArray;

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
                    'images' => $product->images,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'store_name' => $product->store->name,
                    'store_slug' => $product->store->slug,
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
     * Get Payment data and create a pending order
     * @todo add shipping price  to total
     */
    public function getOrderPaymentData(StoreOrderRequest $request, Cart $cart): array
    {
        $cart = Cart::findOrFail($cart->id);
        $cartItems = $cart->products()->with('store')->get()->groupBy('store_id');

        foreach ($cartItems as $storeId => $items) {
            $subtotal = $items->sum(function ($item) {
                return $item->pivot->quantity * $item->price;
            });

            $totalAmount = $subtotal;
            $orderNumber = Str::uuid()->toString();

            $order = Order::create([
                'store_id' => $storeId,
                'user_id' => $request->user()->id,
                'order_number' => $orderNumber,
                'first_name' => $request->validated('first_name'),
                'last_name' => $request->validated('last_name'),
                'email' => $request->validated('email'),
                'phone' => $request->validated('phone'),
                'subtotal' => $subtotal,
                'uid' => Str::uuid()->toString(),
                'total_amount' => $totalAmount,
                'type' => ListingType::PRODUCT->value,
                'status' => OrderStatusEnum::PENDING->value,
                'payment_status' => OrderStatusEnum::PENDING_PAYMENT->value,
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


            return collect($order)->merge([
                'currency_code' => $request->validated('currency_code')
            ])->toArray();
        }
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


    /**
     * Add product to wishlist from cart
     */
    public function addToWishlistFromCart(Request $request, Listing $product)
    {
        abort_if($product->type !== ListingType::PRODUCT->value, 400, 'The specified listing is not a product.');
        abort_if(!$product->is_available, 400, 'The product is currently unavailable.');

        $user = $request->user();

        $wishlistExists = $user->wishlist()->where('listing_id', $product->id)->exists();
        abort_if($wishlistExists, 422, 'The product is already in your wishlist.');

        $cart = $user->carts()
            ->with('products')
            ->whereHas('products', function ($query) use ($product) {
                $query->where('listing_id', $product->id);
            })
            ->first();

        abort_if(!$cart, 404, 'The product is not found in your cart.');

        DB::transaction(function () use ($user, $product, $cart) {
            $cart->products()->detach($product->id);
            $user->wishlist()->attach($product->id);

            if ($cart->products()->count() === 0) {
                $cart->delete();
            }
        });

        return 'Product added to wishlist successfully and removed from cart.';
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
}
