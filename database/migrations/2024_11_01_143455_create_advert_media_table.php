<?php

use App\Enums\AdvertMediaType;
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
        Schema::create('advert_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advert_listing_id')->constrained('advert_listings')->onDelete('cascade');
            $table->string('file_path');
            $table->string('type')->default(AdvertMediaType::IMAGE);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advert_media');
    }
};
