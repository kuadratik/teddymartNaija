<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chat\ConversationRequest;
use App\Services\Chat\ChatService;
use Illuminate\Http\Request;

class ChatsController extends Controller
{
    public function startConversation(ConversationRequest $request)
    {
        (new ChatService)->startConversation($request->conversationAttributes());
        return $this->success();
    }
}
