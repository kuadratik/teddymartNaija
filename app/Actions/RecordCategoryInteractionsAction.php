<?php

namespace App\Actions;

use App\Models\Listing;
use Illuminate\Http\Request;

class RecordCategoryInteractionsAction
{
    public function record(Request $request)
    {
        $categoryIds = Listing::whereLike('name', "%$request->search%")->distinct()->pluck('category_id');

        $categories  = $categoryIds->map(fn ($item) => [
            'category' => $item,
            'interaction_count' => 1
        ]);

        $recordUserInteractionAction = new RecordUserInteractionAction();
        $recordUserInteractionAction->record($categories, $request->header('interactUid'));
    }
}
