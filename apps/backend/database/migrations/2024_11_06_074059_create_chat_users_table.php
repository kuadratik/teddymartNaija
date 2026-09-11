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
        Schema::create('chat_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chat_id')->index();
            $table->morphs('user');
            $table->boolean('is_removed')->default(false)->index();
            $table->dateTime('read_at')->index();
            $table->timestamps();
            $table->unique(['chat_id', 'user_id']);

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_users');
    }
};
