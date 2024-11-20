<?php

use App\Enums\PaymentStatusEnum;
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
        Schema::create('advert_listing_promote_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advert_listing_id')->constrained('advert_listings')->cascadeOnDelete();
            $table->foreignId('advert_promote_plan_id')->constrained('advert_promote_plans')->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('status')->default(PaymentStatusEnum::PENDING)->index();
            $table->timestamps();

            $table->unique(['advert_listing_id', 'advert_promote_plan_id', 'status'], 'unique_active_promotion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advert_listing_promote_plans');
    }
};
