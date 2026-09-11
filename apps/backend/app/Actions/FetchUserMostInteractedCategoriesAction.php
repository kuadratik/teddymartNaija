<?php

namespace App\Actions;

use App\Models\UserInteraction;
use Illuminate\Http\Request;

class FetchUserMostInteractedCategoriesAction
{
    public function fetch()
    {
        $userInteraction = UserInteraction::where('user_uid', request()->header('interactUid'))->first();

        if (is_null($userInteraction)) {
           abort(404, 'User interaction not found for the given Interact UID.');
        }

        $userInteractions = collect(json_decode($userInteraction->interactions, true));
        $mostUsedCategories = $userInteractions->sortByDesc('interaction_count')->pluck('category');

        return $mostUsedCategories->toArray();
    }
}
