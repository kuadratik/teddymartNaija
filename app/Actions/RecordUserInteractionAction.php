<?php

namespace App\Actions;

use App\Models\UserInteraction;

class RecordUserInteractionAction
{
    /**
     * Record user interaction
     */
    public function record($categories, $userUid)
    {
        $userInteraction = UserInteraction::firstOrCreate(['user_uid' => $userUid]);

        if ($userInteraction) {

            $interactions = collect(json_decode($userInteraction->interactions, true));
            $categoriesMap = collect($categories)->keyBy('category');

            // Update category interaction
            $updatedData = $interactions->map(function ($item) use ($categoriesMap) {

                if ($categoriesMap->has($item['category'])) {

                    $item['interaction_count'] += $categoriesMap->get($item['category'])['interaction_count'];
                    $categoriesMap->forget($item['category']);
                }
                return $item;
            });

            // Add new category interaction
            $categoriesMap->each(function ($item) use (&$updatedData) {
                $updatedData->push([
                    'category' => $item['category'],
                    'interaction_count' => $item['interaction_count']
                ]);
            });

            $userInteraction->interactions = $updatedData->toJson();
            $userInteraction->save();
        }
    }
}
