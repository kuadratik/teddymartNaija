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
            $table->boolean('is_available')->default(true)->after('price')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advert_listings', function (Blueprint $table) {
            $table->dropColumn('is_available');
        });
    }
};
