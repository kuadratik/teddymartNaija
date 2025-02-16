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
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropUnique('wishlists_user_id_listing_id_unique');

            $table->unique(['user_id', 'wishlistable_id', 'wishlistable_type'], 'wishlists_user_id_wishlistable_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropUnique('wishlists_user_id_wishlistable_unique');

            $table->unique(['user_id', 'listing_id'], 'wishlists_user_id_listing_id_unique');
        });
    }
};
