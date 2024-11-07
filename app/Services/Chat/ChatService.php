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
        $respondent =  User::find($details['user_id']);
        $user = auth()->user();

        DB::beginTransaction();
        try {
            $chat = Chat::firstOrCreate(['pr_check' => $details['identifier']], [
                'uid' => Str::uuid(),
                'user_id' => $user->id,
                'user_type' => $user->user_type,
                'converse_type' => 'private',
                'name' => null,
                'pr_check' =>  $details['identifier']
            ]);

            $chatUsers = [
                [
                    'chat_id' => $chat->id,
                    'user_type' => $user->user_type,
                    'user_id' => $user->id,
                    'read_at' => now()->copy()->toDateTime(),
                ],
                [
                    'chat_id' => $chat->id,
                    'user_type' => $respondent->user_type,
                    'user_id' => $respondent->id,
                    'read_at' => now()->copy()->subMinutes(1),
                ]
            ];

            ChatUser::upsert($chatUsers, ['chat_id', 'user_id', 'read_at']);

            $message = Message::create([
                'chat_id' => $chat->id,
                'user_id' => $user->id,
                'user_type' => $user->user_type,
                'body' => $details['message'],
            ]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
