<?php

use App\Enums\ListingType;
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
        Schema::table('advert_listings', function (Blueprint $table) {
            $table->string('type')->after('id')->default(ListingType::PRODUCT)->index();
            $table->integer('quantity')->after('type')->nullable()->default(1)->index();
            $table->dropColumn('condition');
            $table->foreignId('user_id')->constrained('users')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advert_listings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->dropColumn(['type', 'quantity']);
            $table->string('condition');
        });
    }
};
