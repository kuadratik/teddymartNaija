<?php

namespace App\Services\Chat;

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

            ChatUser::upsert($chatUsers, ['chat_id', 'user_id', 'read_at']);

            $message = Message::create([
                'chat_id' => $chat->id,
                'user_id' => $user->id,
                'user_type' => $userType,
                'content' => $details['message'],
            ]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
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
}
