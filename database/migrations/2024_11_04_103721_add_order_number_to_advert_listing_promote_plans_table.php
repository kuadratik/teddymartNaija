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
        Schema::table('advert_listing_promote_plans', function (Blueprint $table) {
            $table->string('order_number')->nullable()->after('payment_id')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advert_listing_promote_plans', function (Blueprint $table) {
            $table->dropColumn('order_number');
        });
    }
};
