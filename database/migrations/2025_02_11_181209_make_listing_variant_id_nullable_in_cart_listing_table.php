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
        Schema::table('cart_listing', function (Blueprint $table) {
            $table->foreignId('listing_variant_id')
                ->nullable()
                ->after('quantity')
                ->constrained('listing_variants')
                ->cascadeOnDelete();

            $table->boolean('is_varient')->default(false)->after('listing_variant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_listing', function (Blueprint $table) {
            $table->dropColumn(['listing_variant_id', 'is_varient']);
        });
    }
};
