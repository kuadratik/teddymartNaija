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
        Schema::table('store_shipping_methods', function (Blueprint $table) {
            $table->integer('duration_number')->after('is_unique')->nullable()->index();
            $table->string('duration_type')->after('duration_number')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_shipping_methods', function (Blueprint $table) {
            $table->dropColumn(['duration_number', 'duration_type']);
        });
    }
};
