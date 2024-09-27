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
        $cart = $this->cartService->getCart($request);
        return  $this->success($cart->load('products'));
    }
}
