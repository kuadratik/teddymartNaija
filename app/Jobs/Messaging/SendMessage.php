<?php

namespace App\Jobs\Messaging;

use App\Events\GotMessage;
use App\Models\Message;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendMessage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public array $message)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        GotMessage::dispatch($this->message);
    }
}
