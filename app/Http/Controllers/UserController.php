<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClipRequest;
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
     * get users profile details
     */
    public function getUserProfile(Request $request)
    {
        $user = $request->user('api')->load('store');
        return  $this->success($user);
    }

    /**
     * update users profile
     */
    public function updateUserProfile(UpdateUserRequest $request,)
    {
        User::where('id', auth('api')->user()->id)->update($request->validated());
        return $this->success();
    }

    /**
     * update users password
     */
    public function updateUserPassword(UpdateUserPasswordRequest $request)
    {
        $this->userService->updateUserPassword($request->validated());
        return $this->success();
    }


    /**
     * add product to clips
     */
    public function  addToClip(Request $request, Listing $product)
    {
        $clip = $this->userService->addToClip($request, $product->id);
        return $this->success();
    }

    /**
     * get clips data
     */
    public function getClips()
    {
        $clips = $this->userService->getClips();
        return $this->success($clips);
    }

    /**
     * view clip items
     */
    public function viewClipItems(Clip $clip)
    {
        $clips = $this->userService->getClipItems($clip);
        return $this->success($clips);
    }


    /**
     * delete a product in a clip
     */
    public function deleteClipItem(Request $request, Clip $clip, Listing $product)
    {
        $clip->products()->detach($product->id);
        return $this->success();

    }

    /**
     * delete a clip
     */
    public function deleteClip(Clip $clip)
    {
        $clip->delete();
        return $this->success();
    }



}
