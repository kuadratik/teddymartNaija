<?php

namespace App\Services\Auth;

use App\Enums\ListingType;
use App\Models\User;
use App\Support\Utils;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\ClipItemsResource;
use App\Http\Resources\ClipResource;
use App\Models\Clip;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;

class UserService
{



    /**
     * update users password
     */
    public function updateUserPassword($request)
    {
        $user = User::find(auth('api')->user()->id);
        if (!password_verify($request['old_password'], $user->password)) {
            return Utils::validateResp(['new_password' => ['The provided old password is incorrect.']]);
        }
        $user->update(['password' => bcrypt($request['new_password'])]);
        return true;
    }


    /**
     * add product to clip
     */
    public function addToClip(User $user, $productId)
    {
        DB::transaction(function () use ($productId) {
            $product = Listing::where('id', $productId)->where('type', ListingType::PRODUCT)->with('store')->first();
            if (!$product) {
                return Utils::validateResp(['error' => ['Product not found']]);
            }

            $storeId = $product->store->id;
            $customerId = auth()->id();

            $clip = Clip::firstOrCreate([
                'store_id' => $storeId,
                'user_id' => $customerId,
            ]);

            $result = $clip->addProduct($product);

            if (!$result) {
                return Utils::validateResp(['error' => ['Product already clipped.']]);
            }

            return $clip;
        });
    }

    /**
     * get all clips for a user
     */
    public function getClips()
    {
        $customerId = auth()->id();
        $clips = Clip::where('user_id', $customerId)->with('products')->get();
        return ClipResource::collection($clips);
    }

    /**
     * get a clip by id
     */

    /**
     * get a clip by id with product details
     */
    public function getClipItems(Clip $clip)
    {
        $customerId = auth()->id();
        $clip = Clip::where('user_id', $customerId)->where('id', $clip->id)->with('products')->firstOrFail();
        $products = $clip->products->map(function ($product) {
            return new ClipItemsResource($product);
        });

        return $products;
    }
    /**
     * delete a clip
     */
    public function deleteClip($clipId)
    {
        $customerId = auth()->id();
        $clip = Clip::where('id', $clipId)->where('user_id', $customerId)->first();
        if (!$clip) {
            return Utils::validateResp(['error' => ['Clip not found.']]);
        }
        $clip->delete();
    }


}
