<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            // $table->dropForeign('wishlists_user_id_foreign');
            // $table->dropForeign('wishlists_listing_id_foreign');
            $table->dropUnique('wishlists_user_id_listing_id_unique');
            $table->dropIndex('wishlists_listing_id_foreign');
            $table->dropColumn('listing_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['user_id', 'wishlistable_id', 'wishlistable_type']);
        });
    }

    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'wishlistable_id', 'wishlistable_type']);
            $table->foreignId('listing_id')
                ->nullable()
                ->after('user_id')
                ->constrained('listings')
                ->onDelete('cascade');
            $table->unique(['user_id', 'listing_id']);
        });

        DB::table('wishlists')
            ->where('wishlistable_type', 'App\Models\Listing')
            ->update([
                'listing_id' => DB::raw('wishlistable_id')
            ]);
    }
};
