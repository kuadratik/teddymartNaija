<?php

use App\Enums\PaymentStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_promote_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency')->nullable()->index();
            $table->text('description')->nullable();
            $table->integer('duration_days')->default(0);
            $table->timestamps();
        });

      ;

        Schema::create('store_promote_plan_store', function (Blueprint $table) {
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->foreignId('store_promote_plan_id')->constrained('store_promote_plans')->cascadeOnDelete();
            $table->string('order_number')->nullable()->index();
            $table->string('status')->default(PaymentStatusEnum::PENDING)->index();
            $table->timestamp('started_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->primary(['store_id', 'store_promote_plan_id', 'status']);
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->unique(['store_id', 'store_promote_plan_id', 'status'], 'unique_store_promotion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_promote_plan_store');
        Schema::dropIfExists('store_promote_plans');
    }
};
