<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_id')->index();
            $table->morphs('user');
            $table->longText('content')->nullable()->fulltext();
            $table->json('attachment')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('user_type');
            $table->index(['chat_id', 'user_id', 'created_at']);
            $table->index('created_at');
            $table->index(['chat_id', 'created_at', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
