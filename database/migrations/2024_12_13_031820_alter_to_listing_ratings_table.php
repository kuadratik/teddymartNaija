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
        Schema::table('listing_ratings', function (Blueprint $table) {
            $table->dropUnique('listing_id');
            $table->unique(['listing_id' , 'user_id'] , 'listing_ratings_2cols_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listing_ratings', function (Blueprint $table) {
            //
        });
    }
};
