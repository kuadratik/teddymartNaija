<?php

namespace App\Services\Chat;

use App\Enums\ListingType;
use App\Jobs\Messaging\SendMessage;
use App\Models\AdvertListing;
use App\Models\Chat;
use App\Models\ChatUser;
use App\Models\Listing;
use App\Models\Message;
use App\Models\ServiceInteraction;
use App\Models\User;
use App\Notifications\CustomerInquiryEmailNotification;
use App\Notifications\CustomerInquiryNotification;
use App\Notifications\Listing\ListingInquiryNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatService
{
    public function __construct()
    {
        // ...existing code...
    }

    /**
     * Initiates or retrieves a chat conversation between users and sends initial message
     *
     * @param  array  $details  Contains user_id, message and other conversation details
     * @return \Illuminate\Support\Collection Message data merged with respondent info
     *
     * @throws \Throwable When database transaction fails
     */
    public function startConversation(array $details)
    {
        $respondent = User::find($details['user_id']);
        $user = auth()->user();

        DB::beginTransaction();
        try {
            $chat = $this->createOrGetChat($details, $user);
            $this->addChatUsers($chat, $user, $respondent);

            $message = $this->createMessage($chat->id, $user, $details['message']);
            SendMessage::dispatch($message->toArray(), $respondent->id)->afterCommit();

            $this->handleNotifications($details, $message, $respondent, $user);

            DB::commit();

            return collect($message)->merge(['respondent' => $respondent]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Creates a new chat or retrieves an existing one based on the identifier
     *
     * @param  array  $details  Array containing chat details including identifier
     * @param  mixed  $user  User object for the chat
     * @return \App\Models\Chat Created or retrieved chat instance
     */
    private function createOrGetChat(array $details, $user)
    {
        return Chat::firstOrCreate(['identifier' => $details['identifier']], [
            'uuid' => Str::uuid(),
            'user_id' => $user->id,
            'user_type' => $this->getUserType($user),
            'converse_type' => 'private',
            'title' => null,
            'identifier' => $details['identifier'],
        ]);
    }

    /**
     * Adds or updates users to a chat conversation and handles email notifications
     *
     * @param  Chat  $chat  The chat instance to add users to
     * @param  User  $user  The initiating user
     * @param  User  $respondent  The responding user
     * @return void
     */
    private function addChatUsers($chat, $user, $respondent)
    {
        $existingChat = ChatUser::where('chat_id', $chat->id)
            ->where('user_id', $respondent->id)
            ->exists();
        logger("existing chart exist? {$existingChat}");
        $chatUsers = [
            [
                'chat_id' => $chat->id,
                'user_type' => $this->getUserType($user),
                'user_id' => $user->id,
                'read_at' => now(),
            ],
            [
                'chat_id' => $chat->id,
                'user_type' => $this->getUserType($respondent),
                'user_id' => $respondent->id,
                'read_at' => now()->subMinutes(1),
            ],
        ];

        ChatUser::upsert($chatUsers, ['chat_id', 'user_id']);

        if (! $existingChat) {
            logger("no existing chart dosnt exist sending mail {$existingChat}");
            $this->sendCustomerInquiryEmail($user, $respondent);
        }
    }

    /**
     * Sends a customer inquiry email notification to the vendor
     *
     * @param  User  $customer  The customer making the inquiry
     * @param  User  $vendor  The vendor receiving the notification
     * @return void
     */
    private function sendCustomerInquiryEmail($vendor, $customer)
    {
        $vendor->notify(new CustomerInquiryEmailNotification($customer));
    }

    /**
     * Creates a new message record in the chat
     *
     * @param  int  $chatId  The ID of the chat
     * @param  User  $user  The user sending the message
     * @param  string  $content  The message content
     * @return Message The created message model
     */
    private function createMessage($chatId, $user, $content)
    {
        return Message::create([
            'chat_id' => $chatId,
            'user_id' => $user->id,
            'user_type' => $this->getUserType($user),
            'content' => $content,
        ]);
    }

    /**
     * Handles notification dispatch based on conversation route and listing type
     *
     * @param  array  $details  Array containing listing/advert IDs
     * @param  Message  $message  Message instance
     * @param  User  $respondent  User receiving the notification
     * @param  User  $user  User initiating the interaction
     * @return void
     */
    private function handleNotifications($details, $message, $respondent, $user)
    {
        $advertListing = AdvertListing::find($details['advert_id'] ?? null);
        $listing = Listing::find($details['listing_id'] ?? null);

        if (request()->convoRoute === 'gallery' && $advertListing) {
            $respondent->notify(new CustomerInquiryNotification($respondent->toArray(), $advertListing));
        }

        if (request()->convoRoute === 'listing' && $listing) {
            if ($listing->type === ListingType::SERVICE->value) {
                ServiceInteraction::firstOrCreate(['listing_id' => $listing->id, 'user_id' => $user->id]);
            }
            $respondent->notify(new ListingInquiryNotification($respondent->toArray(), $listing));
        }

        if (request()->convoRoute === 'directory' && $listing) {
            $respondent->notify(new CustomerInquiryEmailNotification($respondent->toArray(), $listing));
        }
    }

    /**
     * Sends a message in a chat and dispatches a notification job
     *
     * @param  array  $details  Array containing chat_id and message content
     * @return void
     *
     * @throws \Throwable When message creation or dispatch fails
     */
    public function sendMessage($details)
    {
        $user = request()->user();
        $chatUser = ChatUser::where('user_id', '!=', $user->id)->first();

        DB::beginTransaction();
        try {
            $message = $this->createMessage($details['chat_id'], $user, $details['message']);
            SendMessage::dispatch($message->toArray(), $chatUser->user_id)->afterCommit();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Retrieves paginated messages for a specific chat
     *
     * @param  int  $chatId  The ID of the chat to get messages for
     * @return \Illuminate\Pagination\CursorPaginator Collection of messages with user data
     */
    public function chatMessages($chatId)
    {
        $messages = Message::where('chat_id', $chatId)->latest('created_at')->cursorPaginate();
        $messages->each(fn($message) => $this->setMessageUser($message));

        return $messages;
    }

    /**
     * Retrieves chat details with participants by UUID
     *
     * @param  string  $uid  The chat UUID
     * @return \App\Models\Chat Chat model with loaded participant relations
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function chatDetails($uid)
    {
        $chat = Chat::where('uuid', $uid)->with('participants')->firstOrFail();
        $chat->participants->each(fn($respondent) => $this->setParticipantRelation($respondent));

        return $chat;
    }

    /**
     * Sets the participant relation data for a respondent
     *
     * @param  object  $respondent  The respondent object to set relation data for
     * @return void
     */
    private function setParticipantRelation($respondent)
    {
        $respondent->relation = [
            'user_id' => $respondent->user_id,
            'first_name' => $respondent->user->first_name,
            'last_name' => $respondent->user->last_name,
            'user_type' => $respondent->user_type,
        ];
    }

    /**
     * Updates the read timestamp for a chat user and returns their unread message count
     *
     * @param  int  $chatId  The ID of the chat to update
     * @return \App\Models\ChatUser Updated chat user model with unread count
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function updateReadAt($chatId)
    {
        $chatUser = ChatUser::where('chat_id', $chatId)->where('user_id', auth()->id())->first();
        abort_if(! $chatUser->update(['read_at' => now()]), 409, 'Unable to update chat user read time.');

        $chatUser->unread = $this->unreadQuery($chatUser->chat_id, $chatUser->read_at)->first()?->read ?? 0;

        return $chatUser;
    }

    /**
     * Retrieves paginated chat conversations for the authenticated user.
     *
     * Fetches chats with read status, last messages, and unread counts.
     * Includes filtering by participant name if search parameter provided.
     *
     * @return \Illuminate\Pagination\CursorPaginator
     */
    public function chats()
    {
        $chats = Chat::query()->addSelect(['read_at' => ChatUser::subLastRead()])
            ->whereHas('participants', fn($participant) => $participant->authUser())
            ->cursorPaginate(40);

        $privateChatIds = $chats->where('converse_type', 'private')->pluck('id');
        $respondents = $this->getRespondents($privateChatIds);
        $lastMessages = $this->getLastMessages($chats->pluck('id'));
        $unreads = $this->getUnReads($chats);

        $chats->each(fn($chat) => $this->setChatsState($chat, $respondents, $lastMessages, $unreads));

        return $chats->when(request()->name, fn($query) => $query->filter(fn($chat) => $this->doesNameContainSearchParam($chat)))->values();
    }

    /**
     * Retrieves respondent users from private chats excluding the authenticated user
     *
     * @param  \Illuminate\Support\Collection  $privateChatIds  Collection of private chat IDs
     * @return \Illuminate\Database\Eloquent\Collection|null Collection of ChatUser models or null if empty
     */
    private function getRespondents($privateChatIds)
    {
        return $privateChatIds->whenNotEmpty(fn($ids) => ChatUser::whereIn('chat_id', $ids)->where('user_id', '<>', auth()->id())->get());
    }

    /**
     * Checks if the chat respondent's name contains the searched parameter
     *
     * @param  array  $chat  Chat data containing respondent information
     * @return bool Whether the respondent's name matches the search parameter
     */
    private function doesNameContainSearchParam($chat)
    {
        $searchedName = Str::lower(request()->name);
        $respondent = $chat['respondent'];

        return isset($respondent['first_name'], $respondent['last_name']) &&
            (Str::contains(Str::lower($respondent['first_name']), $searchedName) ||
                Str::contains(Str::lower($respondent['last_name']), $searchedName));
    }

    /**
     * Sets chat state by populating respondent details, last message and unread count
     *
     * @param  Chat  $chat  Chat model instance to update
     * @param  Collection  $respondents  Collection of chat respondents
     * @param  Collection  $lastMessages  Collection of last messages
     * @param  Collection  $unreads  Collection of unread message counts
     * @return void
     */
    public function setChatsState(&$chat, $respondents, $lastMessages, $unreads)
    {
        $match = $respondents->where('chat_id', $chat->id)->first();
        $chat->respondent = $match ? [
            'user_id' => $match->user->id,
            'first_name' => $match->user->first_name,
            'last_name' => $match->user->last_name,
            'user_type' => $match->user_type,
        ] : null;
        $chat->lastMessage = $lastMessages->where('chat_id', $chat->id)->first();
        $chat->unread = $unreads->where('chat_id', $chat->id)->first()?->unread ?? 0;
    }

    /**
     * Gets unread messages for a collection of chats
     *
     * @param  \Illuminate\Support\Collection  $chats  Collection of chat models
     * @return \Illuminate\Support\Collection|null Collection of unread messages or null if empty
     */
    public function getLastMessages($chatIds)
    {
        // return collect($chatIds)->whenNotEmpty(fn($ids) => Message::select('*')
        //     ->whereIn('chat_id', $ids)
        //     ->whereRaw('id = (SELECT MAX(id) FROM messages WHERE chat_id = messages.chat_id)')
        //     ->get());

        return collect($chatIds)->whenNotEmpty(fn($ids) => Message::select('messages.*')
            ->joinSub(
                DB::table('messages')
                    ->select('chat_id', DB::raw('MAX(id) as max_id'))
                    ->whereIn('chat_id', $ids)
                    ->groupBy('chat_id'),
                'latest',
            fn($join) => $join->on('messages.chat_id', 'latest.chat_id')->on('messages.id', 'latest.max_id')
            )
            ->get());
    }

    /**
     * Gets unread messages for a collection of chats
     *
     * @param  \Illuminate\Support\Collection  $chats  Collection of chat models
     * @return \Illuminate\Support\Collection|null Collection of unread messages or null if empty
     */
    public function getUnReads($chats)
    {
        return $chats->whenNotEmpty(fn($chats) => $chats->map(fn($chat) => $this->unreadQuery($chat->id, $chat->read_at))
            ->reduce(fn($c, $q) => $c ? $c->union($q) : $q, null)?->get());
    }

    /**
     * Get count of unread messages for a specific chat since last read
     *
     * @param  int  $chatId  The ID of the chat to query
     * @param  string  $readAt  Timestamp of last read
     * @return \Illuminate\Database\Query\Builder Query builder with unread count
     */
    public function unreadQuery($chatId, $readAt)
    {
        return Message::selectRaw('COUNT(*) as unread')->addSelect('chat_id')
            ->where('chat_id', $chatId)
            ->where('user_id', '<>', auth()->id())
            ->where('created_at', '>', $readAt)
            ->groupBy('chat_id');
    }

    /**
     * Determines the type of user based on the model class
     *
     * @param  mixed  $model  The model instance to check
     * @return string The user type ('user' or 'admin')
     */
    public function getUserType($model)
    {
        return match (get_class($model)) {
            'App\Models\User' => 'user',
            'App\Models\Admin' => 'admin',
        };
    }

    /**
     * Sets the user information for a message object
     *
     * @param  Message  $message  Message object to be modified by reference
     * @return void
     */
    public function setMessageUser(&$message)
    {
        $message->user = $message->user ? [
            'user_id' => $message->user_id,
            'first_name' => $message->user->first_name,
            'last_name' => $message->user->last_name,
            'email' => $message->user->email,
            'user_type' => $message->user_type,
        ] : null;
    }
}
