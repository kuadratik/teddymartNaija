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
        Schema::dropIfExists('user_book_business_services');
        Schema::dropIfExists('business_service_time_slots');
        Schema::dropIfExists('business_service_availabilities');
        Schema::dropIfExists('business_listings');
        Schema::dropIfExists('industries');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank: the Directory feature and its models were
        // removed from the codebase, so there is nothing to recreate these
        // tables against. Restore from a database backup if this needs undoing.
    }
};
