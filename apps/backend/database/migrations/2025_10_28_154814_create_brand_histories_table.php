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
        Schema::create('brand_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->string('brand_name');
            $table->string('admin_name');
            $table->string('old_slug')->nullable();
            $table->string('old_target_url')->nullable();
            $table->string('old_source_url')->nullable();
            $table->string('new_slug')->nullable();
            $table->string('new_target_url')->nullable();
            $table->string('new_source_url')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_histories');
    }
};
