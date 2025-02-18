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
        Schema::create('advert_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advert_listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('guest_id')->nullable();
            $table->tinyInteger('rating')->unsigned()->comment('1-5 stars');
            $table->text('review')->nullable();
            $table->timestamps();
            $table->unique(['advert_listing_id', 'user_id']);
            $table->unique(['advert_listing_id', 'guest_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advert_ratings');
    }
};
