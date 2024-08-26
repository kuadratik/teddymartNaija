<?php

namespace App\Actions;

use App\Models\UserInteraction;

class FetchUserMostInteractedCategoriesAction
{
    public function fetch()
    {
        $userInteraction = UserInteraction::where('user_uid', request()->header('Interact_Uid'))->first();
        $userInteractions = collect(json_decode($userInteraction->interactions, true));
        $mostUsedCategories = $userInteractions->sortByDesc('interaction_count')->pluck('category');

        return $mostUsedCategories->toArray();
    }
}
