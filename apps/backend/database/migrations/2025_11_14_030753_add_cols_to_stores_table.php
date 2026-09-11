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
        Schema::table('stores', function (Blueprint $table) {
            $table->text('action_note')->nullable()->fulltext();
            $table->string('fee_gateway')->nullable()->index();
            $table->dateTime('fee_paid_at')->nullable()->index();
            $table->foreignId('store_fee_history_id')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['action_note', 'fee_gateway', 'fee_paid_at', 'store_fee_history_id']);
        });
    }
};
