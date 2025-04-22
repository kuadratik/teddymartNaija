<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVariantIdToWishlistsTable extends Migration
{
    public function up()
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->unsignedBigInteger('variant_id')->nullable()->after('wishlistable_type');
        });
    }

    public function down()
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropColumn('variant_id');
        });
    }
}
