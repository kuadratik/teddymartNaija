<?php

use App\Enums\ListingType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('name')->nullable()->change();
            $table->string('slug')->nullable()->change();
            $table->foreignId('category_id')->nullable()->change();
            $table->string('type')->default(ListingType::PRODUCT)->nullable()->change();
            $table->longText('description')->nullable()->change();
            $table->integer('quantity')->default(1)->nullable()->change();
            $table->json('images')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
             $table->string('name')->change();
            $table->string('slug')->change();
            $table->string('type')->change();
            $table->longText('description')->change();
            $table->integer('quantity')->default(0)->change();
            $table->json('images')->change();
            $table->foreignId('category_id')->change();

        });
    }
};
