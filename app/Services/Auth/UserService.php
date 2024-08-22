<?php

namespace App\Services\Auth;

use App\Enums\ListingType;
use App\Http\Requests\ClipRequest;
use App\Models\User;
use App\Support\Utils;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\ClipItemsResource;
use App\Http\Resources\ClipResource;
use App\Models\Clip;
use Illuminate\Support\Str;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

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
    public function addToClip(Request $request, $productId)
    {
        DB::transaction(function () use ($request, $productId) {
            $product = Listing::where('id', $productId)->where('type', ListingType::PRODUCT)->with('store')->first();
            if (!$product) {
                return Utils::validateResp(['error' => ['Product not found']]);
            }
            $uid = $request->header('Clip-Uid') ?? Str::uuid();
            $storeId = $product->store->id;

            if (auth()->user()) {
                $customerId = auth()->user()->id;
            }

            $clip = Clip::firstOrCreate([
                'store_id' => $storeId,
                'user_id' => @$customerId,
                'uid' => $uid
            ]);

            $result = $clip->addProduct($product);

            if (!$result) {
                return Utils::validateResp(['error' => ['Product already clipped.']]);
            }

            return $clip;
        });
    }

    /**
     * Get all clips for a user.
     */
    public function getClips()
    {
        $customerId = auth()->id();
        $clipUid = request()->header('Clip-Uid');
        $clips = Clip::query()
            ->when($customerId, function ($query) use ($customerId) {
                return $query->where('user_id', $customerId);
            })
            ->when(!$customerId && $clipUid, function ($query) use ($clipUid) {
                return $query->where('uid', $clipUid);
            })
            ->with('products')
            ->get();

        return ClipResource::collection($clips);
    }



    /**
     * Get a clip by ID with product details.
     */
    public function getClipItems(Clip $clip)
    {
        $customerId = auth()->id();

        $clipUid = request()->header('Clip-Uid');

        $clipData = Clip::query()
            ->when($customerId, function ($query) use ($customerId, $clip) {
                return $query->where('user_id', $customerId)->where('id', $clip->id);
            })
            ->when(!$customerId && $clipUid, function ($query) use ($clipUid, $clip) {
                return $query->where('uid', $clipUid)->where('id', $clip->id);
            })
            ->with('products')->firstOrFail();



        $products = $clipData->products->map(function ($product) {
            return new ClipItemsResource($product);
        });

        return $products;
    }
}
