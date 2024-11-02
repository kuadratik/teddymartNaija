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
        Schema::table('advert_listings', function (Blueprint $table) {
            $table->dropColumn('location');
            $table->foreignId('country_id')->after('price')->constrained('countries');
            $table->string('state')->after('country_id')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advert_listings', function (Blueprint $table) {
            $table->dropColumn('state');
            $table->dropForeign(['country_id']);
            $table->dropColumn(['country_id', 'state']);
            $table->string('location')->after('price');
        });
    }
};
