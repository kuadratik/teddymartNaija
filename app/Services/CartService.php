<?php

namespace App\Services;

use App\Enums\ListingType;
use App\Models\Cart;
use App\Models\Listing;
use App\Support\Utils;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CartService
{
    /**
     * Get detailed cart information including total items and product details
     */
    public function getCartDetails(Request $request)
    {
        $cart = $this->getCart($request)->load('products');
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
                    'total_price' => $product->pivot->quantity * $product->price
                ];
            })
        ];

        return $cartDetails;
    }
    /**
     * Add a product to the user's cart
     */
    public function addToCart(Request $request, Listing $product): Cart
    {
        return DB::transaction(function () use ($request, $product) {
            if ($product->type !== ListingType::PRODUCT->value) {
                return Utils::validateResp(['error' => ['Product not found']]);
            }

            // Get the current cart (either guest or authenticated)
            $cart = $this->getCart($request);

            // Check if the product is already in the cart
            $cartItem = $cart->products()->where('listing_id', $product->id)->first();

            if ($cartItem) {
                // If the product exists, increase the quantity
                $newQuantity = $cartItem->pivot->quantity + 1;
                $cart->products()->updateExistingPivot($product->id, ['quantity' => $newQuantity]);
            } else {
                // If it doesn't exist, add it to the cart with quantity 1
                $cart->products()->syncWithoutDetaching([
                    $product->id => ['quantity' => 1]
                ]);
            }

            return $cart->fresh(['products']);
        });
    }

    private function getCart(Request $request): Cart
    {
        $sessionUid = $request->header('session-uid');
        $user = $request->user();

        // If the user is logged in
        if ($user) {
            // First check if the user already has a cart associated with both session_uid and user_id
            $existingCart = Cart::where('session_uid', $sessionUid)->where('user_id', $user->id)->first();

            if ($existingCart) {
                // If a cart exists with both session_uid and user_id, no need for merging, return it directly
                return $existingCart;
            }

            // Find the guest cart by session UID (for logged-in users who may have added items as a guest)
            $guestCart = Cart::where('session_uid', $sessionUid)->whereNull('user_id')->first();
            // Find the user's cart by user ID (for logged-in users who already have a cart)
            $userCart = Cart::where('user_id', $user->id)->first();

            if ($guestCart && $userCart) {
                // Merge the guest cart into the user cart
                foreach ($guestCart->products as $guestProduct) {
                    $userCartItem = $userCart->products()->where('listing_id', $guestProduct->id)->first();

                    if ($userCartItem) {
                        // If the product exists in the user cart, increase the quantity
                        $newQuantity = $userCartItem->pivot->quantity + $guestProduct->pivot->quantity;
                        $userCart->products()->updateExistingPivot($guestProduct->id, ['quantity' => $newQuantity]);
                    } else {
                        // If the product doesn't exist in the user cart, add it
                        $userCart->products()->attach($guestProduct->id, ['quantity' => $guestProduct->pivot->quantity]);
                    }
                }
                // Delete the guest cart after merging
                $guestCart->delete();

                return $userCart;
            }

            if ($guestCart && !$userCart) {
                // If there's a guest cart but no user cart, assign the guest cart to the user
                $guestCart->user_id = $user->id;
                $guestCart->session_uid = $sessionUid; // Keep the session UID for tracking
                $guestCart->save();

                return $guestCart;
            }

            if (!$guestCart && $userCart) {
                // If there's no guest cart but the user has a cart, return the user's cart
                return $userCart;
            }

            // If no cart exists for either guest or user, create a new cart for the user
            return Cart::create(['user_id' => $user->id, 'session_uid' => $sessionUid]);
        }

        // If the user is not logged in, get or create a cart based on the session UID
        return Cart::firstOrCreate(['session_uid' => $sessionUid]);
    }

}
