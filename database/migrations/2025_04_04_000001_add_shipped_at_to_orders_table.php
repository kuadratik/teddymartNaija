<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('shipped_at')->after('payment_status')->nullable();
            $table->unsignedTinyInteger('delivered_notification_count')->after('shipped_at')->default(0);
            $table->timestamp('vendor_notified_at')->after('delivered_notification_count')->nullable();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shipped_at', 'delivered_notification_count', 'vendor_notified_at']);
        });
    }
};
