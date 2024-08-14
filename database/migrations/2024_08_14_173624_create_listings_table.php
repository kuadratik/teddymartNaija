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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->index();
            $table->foreignId('user_id')->index();
            $table->foreignId('category_id')->index();
            $table->string('name')->index();
            $table->string('slug')->index();
            $table->string('type')->index();
            $table->decimal('price')->nullable();
            $table->longText('description')->index();
            $table->longText('additional_information')->nullable();
            $table->json('images');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
