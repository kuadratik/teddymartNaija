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
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('store_id')->index();
            $table->foreignId('order_id')->index();
            $table->boolean('is_approved')->default(false);
            $table->decimal('amount', 10, 2)->index();
            $table->string('currency')->index();
            $table->string('transfer_recipient', 300)->nullable();
            $table->string('transfer_code')->nullable()->index();
            $table->string('account_number')->nullable()->index();
            $table->string('bank_code')->nullable()->index();
            $table->string('bank_name')->nullable()->index();
            $table->string('status')->index()->comment('status matched to order');
            $table->string('provider_status')->nullable();
            $table->string('provider')->index()->comment('paystack|stripe|manual');
            $table->timestamps();

            $table->unique(['store_id', 'order_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
