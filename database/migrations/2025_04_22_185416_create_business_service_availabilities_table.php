<?php

use App\Enums\BusinessListing\AvailibilityTypeEnum;
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
        Schema::create('business_service_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_listing_id')->constrained('business_listings')->cascadeOnDelete();
            $table->string('service_name')->nullable();
            $table->string('availability_type')->default(AvailibilityTypeEnum::FLEX->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_service_availabilities');
    }
};
