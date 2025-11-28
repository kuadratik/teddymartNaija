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
            if (Schema::hasIndex('stores', 'stores_name_unique')) {
                $table->dropIndex('stores_name_unique');
            }

            if (!Schema::hasIndex('stores', 'stores_slug_unique')) {
                $table->unique('slug');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            // ignore rollback
        });
    }
};
