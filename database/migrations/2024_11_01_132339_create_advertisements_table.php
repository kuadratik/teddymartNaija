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
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->index();
            $table->string('business_name');
            $table->string('business_slug');
            $table->longText('business_description')->nullable();
            $table->string('business_email')->nullable();
            $table->longText('business_address')->nullable();
            $table->string('business_contact_number');
            $table->string('business_logo_url')->nullable();
            $table->boolean('show_business_description')->default(false);
            $table->boolean('show_business_email')->default(false);
            $table->boolean('show_business_address')->default(false);
            $table->string('indetifier')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
