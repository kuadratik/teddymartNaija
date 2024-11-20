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
        Schema::table('listings', function (Blueprint $table) {
            $table->integer('quantity')->after('type')->default(0);
            $table->decimal('discount', 5, 2)->after('price')->nullable();
            $table->decimal('discounted_price', 10, 2)->after('discount')->nullable();
            $table->decimal('display_price', 10, 2)->after('discounted_price')->nullable();
            $table->timestamp('discount_start_date')->after('currency')->nullable();
            $table->timestamp('discount_end_date')->after('discount_start_date')->nullable();
            $table->boolean('is_draft')->after('slug')->default(0);
            $table->string('sku')->after('is_draft')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['quantity', 'discount', 'discounted_price', 'display_price', 'discount_start_date', 'discount_end_date', 'is_draft', 'sku']);
        });
    }
};
