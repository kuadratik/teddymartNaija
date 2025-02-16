<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Wishlist;
use App\Models\Listing;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->unsignedBigInteger('wishlistable_id')->nullable()->after('user_id');
            $table->string('wishlistable_type')->nullable()->after('wishlistable_id');
        });

        foreach (Wishlist::whereNull('wishlistable_type')->get() as $wishlist) {
            $wishlist->wishlistable_id = $wishlist->listing_id;
            $wishlist->wishlistable_type = Listing::class;
            $wishlist->save();
        }

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropForeign(['listing_id']);
            $table->dropColumn('listing_id');
            $table->unsignedBigInteger('wishlistable_id')->nullable(false)->change();
            $table->string('wishlistable_type')->nullable(false)->change();
            $table->unique(['user_id', 'wishlistable_id', 'wishlistable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreignId('listing_id')->nullable()->constrained('listings')->onDelete('cascade');
            $table->dropUnique(['user_id', 'wishlistable_id', 'wishlistable_type']);
            $table->dropColumn(['wishlistable_id', 'wishlistable_type']);
        });
    }
};
