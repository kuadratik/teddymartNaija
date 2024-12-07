<?php

namespace App\Http\Controllers;

use App\Enums\ListingType;
use App\Enums\OrderStatusEnum;
use App\Http\Requests\Cart\StoreOrderRequest;
use App\Http\Requests\Cart\StoreShippingAddressRequest;
use App\Models\Cart;
use App\Models\Listing;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Store;
use App\Models\UserShippingAddress;
use App\Services\CartService;
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

        return $this->success($cart);
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
     * Delete users shipping address
     */
    public function deleteShippingAddress(Request $request, UserShippingAddress $shippingAddress)
    {
        $address = $request->user()->shippingAddress($shippingAddress->id);
        $address->delete();
        return $this->success();
    }


    /**
     * Get user orders
     */
    public function getUserOrders(Request $request)
    {
        $data = $this->cartService->getUserOrders($request);

        return $this->success($data);
    }

    /**
     * Get user's orders
     */
    public function getOrderHistory(Request $request)
    {
        $userOrders = Order::where('user_id', $request->user()->id)->with('store:id,name', 'orderDetails')->get();
        $userOrderHistory = $userOrders->groupBy('order_number');

        return $this->success($userOrderHistory);
    }

    /**
     * Recieve order
     */
    public function recieveOrder(Order $order)
    {
        $order->update(['status' => OrderStatusEnum::DELIVERED->value]);
        return $this->success();
    }

    /**
     * Add product to wishlist
     */
    public function addToWishlist(Request $request, Listing $product)
    {
        abort_if($product->type != ListingType::PRODUCT->value, 400, 'The specified listing is not a product.');
        abort_if(!$product->is_available, 400, 'The product is currently unavailable.');
        $wishlistExists = $request->user()->wishlist()->where('listing_id', $product->id)->exists();
        abort_if($wishlistExists, 422, 'The product is already in your wishlist.');
        $request->user()->wishlist()->attach($product->id);

        return $this->success('Product added to wishlist successfully.');
    }

    /**
     * Add product to wishlist from cart
     */
    public function addToWishlistFromCart(Request $request, Listing $product)
    {
        $message = $this->cartService->addToWishlistFromCart($request, $product);

        return $this->success($message);
    }

    /**
     * Get user wishlist
     */
    public function getUserWishlist(Request $request)
    {
        $wishlist = $request->user()->wishlist()->where('type', 'product')->get();

        return $this->success($wishlist->load('store'));
    }

    /**
     * Remove product from wishlist
     */
    public function removeFromWishlist(Request $request, Listing $product)
    {
        abort_if(!$request->user()->wishlist()->where('listing_id', $product->id)->exists(), 422, 'Product not found in wishlist');
        $request->user()->wishlist()->detach($product->id);

        return $this->success();
    }

    /**
     * Add a product from the wishlist to the cart
     */
    public function addWishlistToCart(Request $request, Listing $product)
    {

        $existsInWishlist = $request->user()->wishlist()->where('listing_id', $product->id)->exists();
        abort_if(!$existsInWishlist, 422, 'Product not found in wishlist');
        $data = $this->cartService->addToCart($request, $product);
        $request->user()->wishlist()->detach($product->id);

        return $this->success($data, 'Product added to cart from wishlist successfully');
    }
}
