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
        Schema::table('business_listings', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->index()->after('id');
            $table->string('color')->after('website_link')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_listings', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'color']);
        });
    }
};
