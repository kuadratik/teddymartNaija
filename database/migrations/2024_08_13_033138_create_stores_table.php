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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('name')->index();
            $table->string('slug')->index();
            $table->string('contact_number')->index();
            $table->string('whatsapp_number')->index();
            $table->string('profile_picture_path');
            $table->string('banner_path');
            $table->longText('description')->index();
            $table->text('address1')->index();
            $table->text('address2')->index();
            $table->string('state');
            $table->string('city');
            $table->string('postal_code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
