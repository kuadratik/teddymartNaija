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
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Update user's password.
     */
    public function updateUserPassword(array $request): bool
    {
        $user = User::find(auth('api')->user()->id);

        if (!password_verify($request['old_password'], $user->password)) {
            return Utils::validateResp(['new_password' => ['The provided old password is incorrect.']]);
        }

        $user->update(['password' => Hash::make($request['new_password'])]);
        return true;
    }

    /**
     * Add product to clip.
     */
    public function addToClip(Request $request, int $productId)
    {
        return DB::transaction(function () use ($request, $productId) {
            $product = Listing::where('id', $productId)->where('type', ListingType::PRODUCT)->with('store')->first();

            if (!$product) {
                return Utils::validateResp(['error' => ['Product not found']]);
            }

            $uid = $request->header('Clip-Uid');
            $storeId = $product->store->id;
            $customerId = auth()->id();

            $clip = Clip::updateOrCreate(
                ['store_id' => $storeId, 'uid' => $uid],
                ['store_id' => $storeId, 'user_id' => $customerId, 'uid' => $uid]
            );

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

        $clips = Clip::when($customerId, fn($query) => $query->where('user_id', $customerId))
            ->when(!$customerId && $clipUid, fn($query) => $query->where('uid', $clipUid))
            ->with('products')
            ->get();

        return ClipResource::collection($clips);
    }

    /**
     * Get a clip by ID with product details.
     */
    public function getClipItems(Clip $clip): array
    {
        $customerId = auth()->id();
        $clipUid = request()->header('Clip-Uid');

        $clipData = Clip::when($customerId, fn($query) => $query->where('user_id', $customerId))
            ->when(!$customerId && $clipUid, fn($query) => $query->where('uid', $clipUid))
            ->where('id', $clip->id)
            ->with('products')
            ->firstOrFail();

        return $clipData->products->map(fn($product) => [
            'name' => $product->name,
            'slug' =>  $product->slug,
            'image' => $product->images[0],
            'price' => $product->price,
        ])->all();
    }



}
