<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('
            CREATE INDEX advert_ratings_created_at_desc_idx
            ON advert_ratings (created_at DESC)
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('
            DROP INDEX advert_ratings_created_at_desc_idx
        ');
    }
};
