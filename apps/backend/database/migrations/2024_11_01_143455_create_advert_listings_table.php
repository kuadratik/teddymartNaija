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
        Schema::create('advert_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('category_id')->constrained('categories');
            $table->string('condition');
            $table->text('description')->nullable();
            $table->boolean('price_on_request')->default(false);
            $table->decimal('price', 10, 2)->nullable();
            $table->string('location');
            $table->string('country_code', 3);
            $table->string('phone_number');
            $table->foreignId('promote_plan_id')->constrained('advert_promote_plans');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advert_listings');
    }
};
