<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('profile_picture_path')->nullable()->change();
            $table->string('banner_path')->nullable()->change();
            $table->string('payment_status')->default('unpaid')->after('type')->index();
            $table->integer('step')->default(1)->index();
            $table->string('order_number')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'step', 'order_number']);
        });
    }
};
