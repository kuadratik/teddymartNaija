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
        Schema::table('clip_listing', function (Blueprint $table) {
            $table->unique(['clip_id', 'listing_id'], 'unique_clip_listing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clip_listing', function (Blueprint $table) {
            $table->dropUnique('unique_clip_listing');
        });
    }
};
