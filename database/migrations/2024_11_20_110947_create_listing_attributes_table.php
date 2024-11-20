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
        Schema::create('listing_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('measurement')->nullable();
            $table->string('product_model')->nullable();
            $table->string('brand')->nullable();
            $table->string('material')->nullable();
            $table->string('color')->nullable();
            $table->json('size')->nullable();
            $table->json('tags')->nullable();
            $table->text('size_chart_html')->nullable();
            $table->string('size_chart_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_attributes');
    }
};
