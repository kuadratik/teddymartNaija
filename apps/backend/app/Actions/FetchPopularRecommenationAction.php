<?php

namespace App\Actions;

use App\Models\UserInteraction;
use Illuminate\Http\Request;

class FetchPopularRecommenationAction
{
    public function fetch(): array
    {
        $userInteractions = UserInteraction::all();

        if ($userInteractions->isEmpty()) {
            return [];
        }

        $popularInteractions = $userInteractions
            ->flatMap(function ($userInteraction) {
                return json_decode($userInteraction->interactions, true);
            })
            ->sortByDesc('interaction_count')
            ->values()
            ->all();

        return $popularInteractions;
    }
}
