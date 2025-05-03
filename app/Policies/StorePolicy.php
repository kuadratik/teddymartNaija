<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StorePolicy
{


    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Store $store): bool
    {
        return $store->user_id === $user->id;
    }
}
