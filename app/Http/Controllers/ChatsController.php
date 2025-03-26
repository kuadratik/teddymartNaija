<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chat\ConversationRequest;
use App\Http\Requests\Chat\MessageRequest;
use App\Http\Requests\Chat\ReadRequest;
use App\Models\Chat;
use App\Models\ChatUser;
use App\Notifications\CustomerInquiryNotification;
use App\Services\Chat\ChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class ChatsController extends Controller
{

    public function __construct(protected ChatService $chatService)
    {
        //
    }
    /**
     *  Start a  conversation
     */
    public function startConversation(ConversationRequest $request)
    {
        $newConversation = $this->chatService->startConversation($request->conversationAttributes());

        return $this->success($newConversation);
    }

    /**
     * Get the chat messages
     */

    public function getChatMessages(Request $request)
    {
        $chatMessages = $this->chatService->chatMessages($request->chat);
        return $this->success($chatMessages);
    }

    /**
     * Get the chat details
     */
    public function getChatDetails(Request $request)
    {
        $chatDetails = $this->chatService->chatDetails($request->uid);
        return $this->success($chatDetails);
    }

    /**
     * Get the list of all conversations
     */
    public function getChats(Request $request)
    {
        $chats = $this->chatService->chats();
        return $this->success($chats);
    }

    /**
     * Send message for existing conversation
     */
    public function sendMessage(MessageRequest $request)
    {
        $this->chatService->sendMessage($request->validated());
        return $this->success();
    }

    /**
     * Update read at
     */
    public function updateReadAt(ReadRequest $request)
    {
        $this->chatService->updateReadAt($request->chat);
        return $this->success();
    }
}
