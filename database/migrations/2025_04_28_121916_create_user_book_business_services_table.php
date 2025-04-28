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
        Schema::create('user_book_business_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('business_service_id')->constrained('business_service_availabilities')->onDelete('cascade');
            $table->foreignId('business_listing_id')->constrained('business_listings')->onDelete('cascade');
            $table->foreignId('service_time_id')->constrained('business_service_time_slots')->onDelete('cascade');
            $table->string('cus_phone_number')->nullable();
            $table->string('cus_email')->nullable();
            $table->string('cus_fullname')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_book_business_services');
    }
};
