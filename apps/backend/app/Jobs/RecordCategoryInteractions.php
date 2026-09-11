<?php

namespace App\Jobs;

use App\Actions\RecordUserInteractionAction;
use App\Models\Listing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RecordCategoryInteractions implements ShouldQueue
{
    use Queueable, InteractsWithQueue, Dispatchable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public $productSearch, public $interactUid)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $categoryIds = Listing::whereLike('name', "%$this->productSearch%")->distinct()->pluck('category_id');

        $categories  = $categoryIds->map(fn ($item) => [
            'category' => $item,
            'interaction_count' => 1
        ]);

        $recordUserInteractionAction = new RecordUserInteractionAction();
        $recordUserInteractionAction->record($categories, $this->interactUid);
    }
}
