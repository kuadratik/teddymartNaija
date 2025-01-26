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
        Schema::table('business_listings', function (Blueprint $table) {
            $table->string('owner_role')->nullable()->after('business_contact_number');
            $table->string('owner_name')->nullable()->after('owner_role');
            $table->foreignId('country_id')->nullable()->index('business_address');
            $table->string('state')->nullable()->index()->after('country_id');
            $table->string('secondary_business_email')->nullable()->after('business_email');
            $table->string('secondary_contact_number')->nullable()->after('business_contact_number');
            $table->string('website_link')->nullable()->after('secondary_contact_number');
            $table->boolean('show_secondary_email')->default(true)->after('show_business_email');
            $table->boolean('show_secondary_contact')->default(true)->after('show_secondary_email');
            $table->boolean('show_website_link')->default(true)->after('show_secondary_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_listings', function (Blueprint $table) {
            $table->dropColumn([
                'owner_role',
                'owner_name',
                'country_id',
                'state',
                'secondary_business_email',
                'secondary_contact_number',
                'website_link',
                'show_secondary_email',
                'show_secondary_contact',
                'show_website_link'
            ]);
        });
    }
};
