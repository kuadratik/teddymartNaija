<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\StoreShippingAddressRequest;
use App\Http\Requests\Cart\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Listing;
use App\Models\UserShippingAddress;
use App\Services\CartService;
use App\Services\Auth\UserService;
use Illuminate\Http\Request;

class CartController extends Controller
{

    public function __construct(public CartService $cartService)
    {
        //
    }

    public function addToCart(Request $request, Listing $product)
    {
        $data = $this->cartService->addToCart($request, $product);
        return $this->success($data);
    }
    /**
     * Get the current cart for both guest and authenticated users
     */
    public function getCart(Request $request)
    {
        $cart = $this->cartService->getCartDetails($request);
        return  $this->success($cart);
    }


    /**
     * Edit cart quantiy
     */
    public function editCart(Request $request, Listing $product)
    {
        $request->validate(['quantity' => 'required|numeric|min:1']);
        $data = $this->cartService->editCartQuantity($request, $product);
        return $this->success($data);
    }


    /**
     * Delete cart item
     */
    public function removeCartItem(Request $request, Listing $product)
    {
        $data = $this->cartService->removeProductFromCart($request, $product);
        return $this->success($data);
    }


    /**
     * clear all cart items
     */
    public function clearCart(Request $request)
    {
        $data = $this->cartService->clearCart($request);
        return $this->success($data);
    }


    /**
     * Create user shipping address
     */
    public function storeShippingAddress(StoreShippingAddressRequest $request)
    {
        $data = UserShippingAddress::create($request->shippingAddressAttribute());
        return $this->success($data->fresh());
    }


    /**
     *  create order
     */
    public function storeCartOrder(StoreOrderRequest $request, Cart $cart)
    {
        $data = $this->cartService->createCartOrder($request, $cart);
        return $this->success();
    }
}
