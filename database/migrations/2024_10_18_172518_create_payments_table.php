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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('reference')->unique()->comment('Payment reference from gateway');
            $table->morphs('payable');
            $table->nullableMorphs('payer');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3);
            $table->string('gateway')->index();
            $table->string('status')->default(PaymentStatusEnum::PENDING->value)->index();
            $table->string('description')->nullable();
            $table->json('meta')->nullable();
            $table->string('period')->nullable();
            $table->timestamp('next_payment_date')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->decimal('refunded_amount', 10, 2)->default(0);
            $table->boolean('is_refunded')->default(false);
            $table->decimal('remaining_amount', 10, 2)->default(0);
            $table->boolean('is_partial')->default(false);
            $table->integer('attempt_count')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->string('error_code')->nullable();
            $table->string('error_message')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
