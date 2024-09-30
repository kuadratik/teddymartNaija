<?php

namespace App\Http\Controllers;

use App\Models\Listing;
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
}
