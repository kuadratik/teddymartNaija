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
        Schema::create('user_shipping_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('country')->nullable();
            $table->string('state');
            $table->string('lga');
            $table->string('city');
            $table->string('landmark')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });


        Schema::create('order_shipping_address', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('shipping_address_id')->constrained('user_shipping_addresses')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_shipping_address');

        Schema::dropIfExists('user_shipping_addresses');
    }
};
