<?php

namespace App\Services;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Http\Requests\Cart\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\CartListing;
use App\Models\Listing;
use App\Models\ListingVariant;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\StoreShippingMethod;
use App\Support\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartService
{
    /**
     * Get detailed cart information including total items and product details
     */
    public function getCartDetails(Request $request)
    {
        $currency = $request->header('currency', 'USD');

        $cart = $this->getCart($request)->load(['products' => function ($query) use ($currency) {
            $query->where('currency', $currency);
        }]);

        $totalCartPrice = $cart->products->sum(function ($product) {
            $variantPrice = $product->pivot->listing_variant_id
                ? ListingVariant::find($product->pivot->listing_variant_id)->display_price
                : null;
            return $product->pivot->quantity * ($variantPrice ?? $product->display_price ?? $product->price);
        });

        $cartDetails = [
            'cart_id' => $cart->id,
            'total_items' => $cart->products->sum('pivot.quantity'),
            'total_quantity' => $cart->products->count(),
            'total_price' => $totalCartPrice,
            'products' => $cart->products->map(function ($product) {
                $variant = $product->pivot->listing_variant_id ? ListingVariant::find($product->pivot->listing_variant_id) : null;
                return [
                    'listing_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'display_price' => $product->display_price,
                    'quantity' => $product->pivot->quantity,
                    'product_quantity' => $product->quantity,
                    'currency_code' => $product->currency,
                    'total_price' => $product->pivot->quantity * $product->price,
                    'images' => $product->images,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'store_name' => $product->store->name,
                    'store_slug' => $product->store->slug,
                    'variant' => $variant ? [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'price' => $variant->price,
                        'display_price' => $variant->display_price,
                        'image' => $variant->images,
                        'quantity' => $variant->quantity,
                    ] : null,
                ];
            }),
        ];

        return $cartDetails;
    }

    /**
     * Adds a product to the user's cart.
     *
     * If the product is already in the cart, the quantity is updated.
     * Handles both regular and variant products.
     */
    public function addToCart(Request $request, Listing $product): Cart
    {
        if ($product->type !== ListingType::PRODUCT->value) {
            return Utils::validateResp(['error' => ['Product not found']]);
        }

        $quantity = $request->input('quantity', 1);
        $variantId = $request->input('variant_id');
        $cart = $this->getCart($request);

        $existingItemQuery = CartListing::query()
            ->where('cart_id', $cart->id)
            ->where('listing_id', $product->id);

        if ($variantId) {
            $existingItemQuery->where('listing_variant_id', $variantId);
        } else {
            $existingItemQuery->whereNull('listing_variant_id');
        }

        $existingItem = $existingItemQuery->first();

        if ($existingItem) {
            $existingItemQuery->update([
                'quantity' => DB::raw("quantity + {$quantity}"),
                'is_variant' => $variantId ? true : false,
                'updated_at' => now(),
            ]);
        } else {
            CartListing::create([
                'cart_id' => $cart->id,
                'listing_id' => $product->id,
                'quantity' => $quantity,
                'is_variant' => $variantId ? true : false,
                'listing_variant_id' => $variantId,
            ]);
        }

        return $cart->fresh(['products']);
    }

    /**
     * Update the quantity of a specific product in the cart.
     */
    public function editCartQuantity(Request $request, Listing $product): Cart
    {
        $cart = $this->getCart($request);

        $query = CartListing::where('cart_id', $cart->id)
            ->where('listing_id', $product->id)
            ->when(
                $request->filled('variant_id'),
                fn($q) => $q->where('listing_variant_id', $request->variant_id),
                fn($q) => $q->whereNull('listing_variant_id')
            );

        $request->quantity <= 0 ? $query->delete() : $query->update(['quantity' => $request->quantity]);

        return $cart->load(['products']);
    }

    /**
     * Delete a product from the cart.
     */
    public function removeProductFromCart(Request $request, Listing $product): Cart|array
    {
        $cart = $this->getCart($request);
        $variantId = $request->input('variant_id');

        $query = CartListing::where('cart_id', $cart->id)
            ->where('listing_id', $product->id)
            ->when($variantId, fn($q) => $q->where('listing_variant_id', $variantId), fn($q) => $q->whereNull('listing_variant_id'));

        abort_if(!$query->exists(), 404, 'Product or variant not found in the cart');

        $query->delete();

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
     *
     * @todo add shipping price  to total
     */
    public function getOrderPaymentData(StoreOrderRequest $request, Cart $cart): array
    {
        $currency = $request->header('currency', 'USD');

        $cartItems = $cart->products()
            ->where('currency', $currency)
            ->with('store')
            ->get()
            ->groupBy('store_id');

        abort_if($cartItems->isEmpty(), 422, "No items in the cart for currency {$currency}.");

        $cumulativeTotalAmount = 0;
        $orderNumber = Str::uuid()->toString();

        $shippingMethods = collect($request->validated('store_shipping_methods'))->keyBy('store_id');

        foreach ($cartItems as $storeId => $items) {
            $store = $items->first()?->store;

            abort_if(!$store || $store->currency !== $currency, 422, "Invalid store or mismatched currency for store ID {$storeId}.");

            $subtotal = $this->calculateSubtotal($items);

            $shippingMethodData = $shippingMethods->get($storeId);

            abort_if(!$shippingMethodData, 422, "Shipping method not provided for store ID {$storeId}.");

            $shippingMethod = StoreShippingMethod::where('id', $shippingMethodData['shipping_method_id'])
                ->where('store_id', $storeId)
                ->first();

            abort_if(!$shippingMethod, 422, "Invalid or unsupported shipping method for store ID {$storeId}.");

            $shippingCost = $shippingMethod->amount ?? 0;
            $totalAmount = $subtotal + $shippingCost;

            $cumulativeTotalAmount += $totalAmount;

            $order = Order::create([
                'store_id' => $storeId,
                'user_id' => $request->user()->id,
                'order_number' => $orderNumber,
                'first_name' => $request->validated('first_name'),
                'last_name' => $request->validated('last_name'),
                'email' => $request->validated('email'),
                'phone' => $request->validated('phone'),
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'uid' => Str::uuid()->toString(),
                'currency' => $currency,
                'total_amount' => $totalAmount,
                'type' => ListingType::PRODUCT->value,
                'status' => OrderStatusEnum::PENDING->value,
                'payment_status' => OrderStatusEnum::PENDING_PAYMENT->value,
                'store_shipping_method_id' => $shippingMethod->id,
                'shipping_address_id' => $request->validated('shipping_address_id')
            ]);

            foreach ($items as $item) {
                $variant = $item->pivot->listing_variant_id ? ListingVariant::find($item->pivot->listing_variant_id) : null;
                OrderDetail::create([
                    'order_id' => $order->id,
                    'listing_id' => $item->id,
                    'listing_name' => $item->name,
                    'listing_price' => $this->getItemPrice($item),
                    'quantity' => $item->pivot->quantity,
                    'variant_id' => $variant ? $variant->id : null,
                    'variant_name' => $variant ? $variant->name : null,
                ]);
            }
        }

        return [
            'currency_code' => $currency,
            'total_amount' => $cumulativeTotalAmount,
            'order_number' => $orderNumber,
            'shipping_address' => $request->validated('shipping_address_id'),
            'return_url' => $request->validated('return_url'),
            'cancel_url' => $request->validated('cancel_url'),
            'email' => $request->validated('email'),
        ];
    }


    /**
     * Calculate the subTotal amount for the cart items
     */
    private function calculateSubtotal($items)
    {
        return $items->sum(function ($item) {
            $price = $this->getItemPrice($item);
            return $item->pivot->quantity * $price;
        });
    }

    /**
     * get single cart item price
     */
    private function getItemPrice($item)
    {
        if ($item->pivot->listing_variant_id) {
            $variant = ListingVariant::find($item->pivot->listing_variant_id);
            return $variant->display_price ?? $variant->price;
        }

        return $item->display_price ?? $item->price;
    }

    /**
     * Get orders for a specific user, with optional status filtering.
     */
    public function getUserOrders(Request $request)
    {
        $user = $request->user();
        $status = $request->query('order_status');

        $orders = Order::with([
            'orderDetails',
            'orderDetails.listing',
            'store',
            'orderDetails.variant',
            'shippingAddress',
            'shippingMethod'

        ])
            ->where('user_id', $user->id)
            ->where('type', ListingType::PRODUCT->value)
            ->when($status, fn($query) => $query->where('status', $status))
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('order_number');

        return $orders->values();
    }

    /**
     * show user order details
     */
    public function showUserOrder(Request $request, Order $order)
    {
        $user = $request->user();
        abort_if($order->user_id !== $user->id, 403, 'You are not authorized to view this order.');
        return $order->load(['orderDetails', 'shippingAddress', 'store', 'customer', 'payments']);
    }

    /**
     * Add product to wishlist from cart
     */
    public function addToWishlistFromCart(Request $request, Listing $product)
    {
        abort_if($product->type !== ListingType::PRODUCT->value, 400, 'The specified listing is not a product.');
        abort_if(! $product->is_available, 400, 'The product is currently unavailable.');

        $user = $request->user();

        $wishlistExists = $user->wishlists()->where('wishlistable_id', $product->id)->exists();
        abort_if($wishlistExists, 422, 'The product is already in your wishlist.');

        $variantId = $request->input('variant_id');

        $cart = $user->carts()
            ->with('products')
            ->whereHas('products', function ($query) use ($product, $variantId) {
                $query->where('listing_id', $product->id)
                    ->when($variantId, fn($q) => $q->where('listing_variant_id', $variantId), fn($q) => $q->whereNull('listing_variant_id'));
            })
            ->first();

        abort_if(! $cart, 404, 'The product or variant is not found in your cart.');

        DB::transaction(function () use ($user, $product, $cart, $variantId) {
            $cart->products()->detach($product->id, ['listing_variant_id' => $variantId]);
            $user->wishlists()->attach($product->id, ['variant_id' => $variantId]);

            if ($cart->products()->count() === 0) {
                $cart->delete();
            }
        });

        return 'Product or variant added to wishlist successfully and removed from cart.';
    }

    /**
     * Retrieve available shipping methods for each store in the cart.
     */
    public function getShippingMethodsCart(Request $request, Cart $cart)
    {
        $currency = $request->header('currency', 'USD');
        $cartItemsByStore = $cart->products()->where('currency', $currency)->with('store')->get()->groupBy('store_id');

        $storeShippingDetails = [];


        foreach ($cartItemsByStore as $storeId => $cartItems) {

            $store = $cartItems->first()->store;

            if (!$store || $store->currency !== $currency) {
                continue;
            }

            $storeShippingMethods = StoreShippingMethod::where('store_id', $store->id)->get();

            $groupedMethods = $storeShippingMethods->groupBy('method_type');
            $storeMethodTypes = $groupedMethods->keys();

            $storeShippingDetails[] = [
                'store_id' => $store->id,
                'store_slug' => $store->slug,
                'store_name' => $store->name,
                'storeMethodTypes' => $storeMethodTypes,
                'storeMethods' => $groupedMethods,
            ];
        }

        return $storeShippingDetails;
    }


    /**
     * customer recieve order
     */
    public function recieveOrder(Order $order): void
    {
        $order->update(['status' => OrderStatusEnum::DELIVERED->value]);
        if (
            $order->wasChanged() &&
            $order->status === OrderStatusEnum::DELIVERED->value
        ) {
            // $order->store->user->notify(new OrderCompletedNotification($order));
        }
    }
    /**
     * Get the user's cart based on the provided request.
     */
    private function getCart(Request $request): Cart
    {
        $sessionUid = $request->header('session-uid');
        $user = $request->user();

        if (! $user) {
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
                    'quantity' => DB::raw("COALESCE(quantity, 0) + {$product->pivot->quantity}"),
                ],
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
     * Add a product to the wishlist.
     */
    public function addProductToWishlist(Request $request, Listing $product): string
    {
        abort_if($product->type != ListingType::PRODUCT->value, 400, 'The specified listing is not a product.');
        abort_if(!$product->is_available, 400, 'The product is currently unavailable.');

        if ($request->user()->hasWishlisted($product)) {
            return 'The product is already in your wishlist.';
        }

        $request->user()->wishlists()->attach($product->id);

        return 'Product added to wishlist successfully.';
    }
}
