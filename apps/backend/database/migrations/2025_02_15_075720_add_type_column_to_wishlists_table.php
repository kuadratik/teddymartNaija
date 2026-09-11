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
            if (! Schema::hasColumn('wishlists', 'wishlistable_id')) {
                $table->unsignedBigInteger('wishlistable_id')->nullable()->after('user_id');
            }
            if (! Schema::hasColumn('wishlists', 'wishlistable_type')) {
                $table->string('wishlistable_type')->nullable()->after('wishlistable_id');
            }
        });

        Wishlist::whereNull('wishlistable_type')
            ->chunkById(100, function ($wishlists) {
                foreach ($wishlists as $wishlist) {
                    $wishlist->wishlistable_id = $wishlist->listing_id;
                    $wishlist->wishlistable_type = Listing::class;
                    $wishlist->save();
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreignId('listing_id')
                ->nullable()
                ->constrained('listings')
                ->onDelete('cascade')
                ->after('user_id');
        });

        DB::transaction(function () {
            DB::table('wishlists')
                ->where('wishlistable_type', Listing::class)
                ->update(['listing_id' => DB::raw('wishlistable_id')]);
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->unique(['user_id', 'listing_id']);
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropColumn(['wishlistable_id', 'wishlistable_type']);
        });
    }
};
