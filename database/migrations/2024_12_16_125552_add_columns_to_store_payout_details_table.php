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
        Schema::table('store_payout_details', function (Blueprint $table) {
            $table->string('detail_type')->after('store_id');
            $table->after('account_number' , function($table){
               $table->string('bank_code')->nullable(); 
               $table->string('sort_code')->nullable(); 
               $table->string('iban')->nullable();
               $table->string('institution_number')->nullable();
               $table->string('transit_number')->nullable();
               $table->text('interac_information')->nullable();
               $table->text('zelle_information')->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_payout_details', function (Blueprint $table) {
            //
        });
    }
};
