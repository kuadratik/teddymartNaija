<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chat\ConversationRequest;
use App\Http\Requests\Chat\MessageRequest;
use App\Http\Requests\Chat\ReadRequest;
use App\Models\Chat;
use App\Models\ChatUser;
use App\Services\Chat\ChatService;
use Illuminate\Http\Request;

class ChatsController extends Controller
{
    /**
     *  Start a  conversation
     */
    public function startConversation(ConversationRequest $request)
    {
       $newConversation = (new ChatService)->startConversation($request->conversationAttributes());
        return $this->success($newConversation);
    }

    /**
     * Get the chat messages
     */

    public function getChatMessages(Request $request)
    {
        $chatMessages = (new ChatService)->chatMessages($request->chat);
        return $this->success($chatMessages);
    }

    /**
     * Get the chat details
     */
    public function getChatDetails(Request $request)
    {
        $chatDetails = (new ChatService)->chatDetails($request->uid);
        return $this->success($chatDetails);
    }

    /**
     * Get the list of all conversations
     */
    public function getChats(Request $request)
    {
        $chats = (new ChatService)->chats();
        return $this->success($chats);
    }

    /**
     * Send message for existing conversation
     */
    public function sendMessage(MessageRequest $request)
    {
        (new ChatService)->sendMessage($request->validated());
        return $this->success();
    }

    /**
     * Update read at
     */
    public function updateReadAt(ReadRequest $request)
    {
        (new ChatService)->updateReadAt($request->chat);
        return $this->success();
    }
}
