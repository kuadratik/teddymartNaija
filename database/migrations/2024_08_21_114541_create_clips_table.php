<?php

use App\Models\Clip;
use App\Models\Listing;
use App\Models\Store;
use App\Models\User;
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
        Schema::create('clips', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Store::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('clip_product', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Clip::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Listing::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clip_product');
        Schema::dropIfExists('clips');
    }
};
