<?php

namespace App\Services\Chat;

use App\Jobs\Messaging\SendMessage;
use App\Models\Chat;
use App\Models\ChatUser;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function startConversation(array $details)
    {
        $respondent = User::find($details['user_id']);
        $respondentType = $this->getUserType($respondent);

        $user = auth()->user();
        $userType = $this->getUserType($user);

        DB::beginTransaction();
        try {
            $chat = Chat::firstOrCreate(['identifier' => $details['identifier']], [
                'uuid' => Str::uuid(),
                'user_id' => $user->id,
                'user_type' => $userType,
                'converse_type' => 'private',
                'title' => null,
                'identifier' =>  $details['identifier']
            ]);

            $chatUsers = [
                [
                    'chat_id' => $chat->id,
                    'user_type' => $userType,
                    'user_id' => $user->id,
                    'read_at' => now()->copy()->toDateTime(),
                ],
                [
                    'chat_id' => $chat->id,
                    'user_type' => $respondentType,
                    'user_id' => $respondent->id,
                    'read_at' => now()->copy()->subMinutes(1),
                ]
            ];

            ChatUser::upsert($chatUsers, ['chat_id', 'user_id']);

            $message = Message::create([
                'chat_id' => $chat->id,
                'user_id' => $user->id,
                'user_type' => $userType,
                'content' => $details['message'],
            ]);


            SendMessage::dispatch($message->toArray(), $respondent->id)->afterCommit();
            DB::commit();
            return $message;
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function sendMessage($details)
    {
        $user = request()->user();
        $chatUser = ChatUser::where('user_id', '!=', $user->id)->first();

        DB::beginTransaction();
        try {

            $message = Message::create([
                'chat_id' => $details['chat_id'],
                'user_id' => $user->id,
                'user_type' => $this->getUserType($user),
                'content' => $details['message'],
            ]);

            SendMessage::dispatch($message->toArray(), $chatUser->user_id)->afterCommit();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function chatMessages($chatId)
    {
        $messages = Message::where('chat_id', $chatId)->latest('created_at')
            ->cursorPaginate();

        $messages->each(fn ($message) => $this->setMessageUser($message));

        return $messages;
    }

    public function chatDetails($uid)
    {
        $chat = Chat::where('uuid', $uid)->with('participants')->firstOrFail();

        $chat?->participants?->each(function ($respondent) {
            $respondent->relation = [
                'user_id' => $respondent->user_id,
                'first_name' => $respondent->user->first_name,
                'last_name' => $respondent->user->last_name,
                'user_type' => $respondent->user_type,
            ];
        });

        return $chat;
    }

    public function updateReadAt($chatId)
    {
        $chatUser = ChatUser::where('chat_id', $chatId)->where('user_id', auth()->id())->first();
        $hasUpdated = (bool) $chatUser->update(['read_at' =>  now()]);

        abort_if(!$hasUpdated, 409, 'Unable to update chat user read time.');

        $read = $this->unreadQuery($chatUser->chat_id, $chatUser->read_at)->first();

        $chatUser->unread = $read?->read ?? 0;
        return $chatUser;
    }

    public function chats()
    {
        $chats = Chat::query()->addSelect(['read_at' => ChatUser::subLastRead()])
            ->whereHas('participants', fn ($participant) => $participant->authUser())
            ->cursorPaginate(40);

        $privateChatIds = $chats->where('converse_type', 'private')->pluck('id');

        $respondents = $privateChatIds->whenNotEmpty(function ($privateChatIds) {
            return ChatUser::whereIn('chat_id', $privateChatIds)
                ->where('user_id', '<>', auth()->id())->get();
        });

        $lastMessages = $this->getLastMessages($chats->pluck('id'));
        $unreads = $this->getUnReads($chats);

        $chats->each(function ($chat) use ($respondents, $lastMessages, $unreads) {
            $this->setChatsState($chat, $respondents, $lastMessages, $unreads);
        });

        return $chats->when(request()->name)->filter(function ($chat) {
            return $this->doesNameContainSearchParam($chat);
        });
    }

    private function doesNameContainSearchParam($chat)
    {
        $searchedName =  Str::lower(request()->name);
        $respondent = $chat['respondent'];

        if (isset($respondent['first_name']) && isset($respondent['last_name'])) {

            return Str::contains(
                Str::lower($respondent['first_name']),
                $searchedName
            ) || Str::contains(Str::lower($respondent['last_name']), $searchedName);
        }
    }

    public function setChatsState(&$chat, $respondent, $lastMessages, $unreads)
    {
        $match = $respondent->where('chat_id', $chat->id)->first();

        $relation = is_null($match) ? null : [
            'user_id' => $match->id,
            'first_name' => $match->user->first_name,
            'last_name' => $match->user->last_name,
            'user_type' => $match->user_type,
        ];

        $chat->respondent = $relation;
        $chat->lastMessage = $lastMessages->where('chat_id', $chat->id)->first();
        $chat->unread = $unreads->where('chat_id', $chat->id)->first()?->unread ?? 0;
    }

    public function getLastMessages($chatIds)
    {
        $lastMessages = collect($chatIds)->when(count($chatIds) > 0)->map(function ($chatId) {
            return  Message::select('*')->where('chat_id', $chatId)
                ->whereRaw("id = (SELECT MAX(id) FROM messages WHERE chat_id = {$chatId})");
        })->reduce(fn ($c, $q) => $c == null ? $q : $c->union($q), null)?->get();

        return $lastMessages;
    }

    public function getUnReads($chats, $excludeId = null)
    {
        $excludeId = is_null($excludeId) ? auth()->id() : $excludeId;

        $unReads = $chats->when(count($chats) > 0)
            ->map(fn ($chat) => $this->unreadQuery($chat->id, $chat->read_at))
            ->reduce(fn ($c, $q) => $c == null ? $q : $c->union($q), null)?->get();

        return $unReads;
    }

    public function unreadQuery($chatId, $readAt, $excludeId = null)
    {
        $excludeId = is_null($excludeId) ? auth()->id() : $excludeId;

        return Message::selectRaw('COUNT(*) as unread')->addSelect('chat_id')
            ->where('chat_id', $chatId)->where('user_id', '<>', $excludeId)
            ->where('created_at', '>', $readAt)->groupBy('chat_id');
    }

    public function getUserType($model)
    {
        $modelClass = get_class($model);

        $userType = match ($modelClass) {
            'App\Models\User' => 'user',
            'App\Models\Admin' => 'admin',
        };

        return $userType;
    }

    public function setMessageUser(&$message)
    {
        $relation = is_null($message?->user) ? null : [
            'user_id' => $message->user_id,
            'first_name' => $message->user->first_name,
            'last_name' => $message->user->last_name,
            'email' => $message->user->email,
            'user_type' => $message->user_type,
        ];

        $message->user = $relation;
    }
}
