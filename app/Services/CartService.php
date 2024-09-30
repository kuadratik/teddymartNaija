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
}
