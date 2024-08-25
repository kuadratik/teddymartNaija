<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreClipOrderRequest;
use App\Http\Requests\User\UpdateUserPasswordRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\Clip;
use App\Models\Listing;
use App\Models\User;
use App\Services\Auth\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(public UserService $userService)
    {
        //
    }

    /**
     * Get user's profile details
     */
    public function getUserProfile(Request $request)
    {
        $user = $request->user()->load('store');
        return $this->success($user);
    }

    /**
     * Update user's profile
     */
    public function updateUserProfile(UpdateUserRequest $request)
    {
        User::find(auth()->id())->update($request->validated());
        return $this->success();
    }

    /**
     * Update user's password
     */
    public function updateUserPassword(UpdateUserPasswordRequest $request)
    {
        $this->userService->updateUserPassword($request->validated());
        return $this->success();
    }

    /**
     * Add product to clips
     */
    public function addToClip(Request $request, Listing $product)
    {
        $this->userService->addToClip($request, $product->id);
        return $this->success();
    }

    /**
     * Get clips data
     */
    public function getClips()
    {
        $clips = $this->userService->getClips();
        return $this->success($clips);
    }

    /**
     * View clip items
     */
    public function viewClipItems(Clip $clip)
    {
        $clips = $this->userService->getClipItems($clip);
        return $this->success($clips);
    }

    /**
     * Delete a product in a clip
     */
    public function deleteClipItem(Request $request, Clip $clip, Listing $product)
    {
        $clip->products()->detach($product->id);
        if ($clip->products()->count() === 0) {
            $clip->delete();
        }
        return $this->success();
    }

    /**
     * Delete a clip
     */
    public function deleteClip(Clip $clip)
    {
        $clip->delete();
        return $this->success();
    }

    /**
     * Store customer info on a clip to send to vendor
     */
    public function storeClipOrder(StoreClipOrderRequest $request, Clip $clip)
    {
        $order = $this->userService->storeClipOrder($request, $clip);
        return $this->success($order);
    }
}
