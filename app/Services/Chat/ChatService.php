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

    private function addChatUsers($chat, $user, $respondent)
    {
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

        $existingChat = ChatUser::where('chat_id', $chat->id)
            ->where('user_id', $respondent->id)
            ->exists();

        if (! $existingChat) {
            $this->sendCustomerInquiryEmail($user, $respondent);
        }
    }

    private function sendCustomerInquiryEmail($customer, $vendor)
    {
        $vendor->notify(new CustomerInquiryEmailNotification($vendor));
    }

    private function createMessage($chatId, $user, $content)
    {
        return Message::create([
            'chat_id' => $chatId,
            'user_id' => $user->id,
            'user_type' => $this->getUserType($user),
            'content' => $content,
        ]);
    }

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
    }

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

    public function chatMessages($chatId)
    {
        $messages = Message::where('chat_id', $chatId)->latest('created_at')->cursorPaginate();
        $messages->each(fn($message) => $this->setMessageUser($message));

        return $messages;
    }

    public function chatDetails($uid)
    {
        $chat = Chat::where('uuid', $uid)->with('participants')->firstOrFail();
        $chat->participants->each(fn($respondent) => $this->setParticipantRelation($respondent));

        return $chat;
    }

    private function setParticipantRelation($respondent)
    {
        $respondent->relation = [
            'user_id' => $respondent->user_id,
            'first_name' => $respondent->user->first_name,
            'last_name' => $respondent->user->last_name,
            'user_type' => $respondent->user_type,
        ];
    }

    public function updateReadAt($chatId)
    {
        $chatUser = ChatUser::where('chat_id', $chatId)->where('user_id', auth()->id())->first();
        abort_if(! $chatUser->update(['read_at' => now()]), 409, 'Unable to update chat user read time.');

        $chatUser->unread = $this->unreadQuery($chatUser->chat_id, $chatUser->read_at)->first()?->read ?? 0;

        return $chatUser;
    }

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

    private function getRespondents($privateChatIds)
    {
        return $privateChatIds->whenNotEmpty(fn($ids) => ChatUser::whereIn('chat_id', $ids)->where('user_id', '<>', auth()->id())->get());
    }

    private function doesNameContainSearchParam($chat)
    {
        $searchedName = Str::lower(request()->name);
        $respondent = $chat['respondent'];

        return isset($respondent['first_name'], $respondent['last_name']) &&
            (Str::contains(Str::lower($respondent['first_name']), $searchedName) ||
                Str::contains(Str::lower($respondent['last_name']), $searchedName));
    }

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

    public function getUnReads($chats)
    {
        return $chats->whenNotEmpty(fn($chats) => $chats->map(fn($chat) => $this->unreadQuery($chat->id, $chat->read_at))
            ->reduce(fn($c, $q) => $c ? $c->union($q) : $q, null)?->get());
    }

    public function unreadQuery($chatId, $readAt)
    {
        return Message::selectRaw('COUNT(*) as unread')->addSelect('chat_id')
            ->where('chat_id', $chatId)
            ->where('user_id', '<>', auth()->id())
            ->where('created_at', '>', $readAt)
            ->groupBy('chat_id');
    }

    public function getUserType($model)
    {
        return match (get_class($model)) {
            'App\Models\User' => 'user',
            'App\Models\Admin' => 'admin',
        };
    }

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
