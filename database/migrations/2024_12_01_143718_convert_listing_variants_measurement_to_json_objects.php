<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('listing_variants')->whereNotNull('measurement')->get()->each(function ($variant) {
            $measurements = json_decode($variant->measurement, true);

            if (!empty($measurements) && is_array($measurements)) {
                $measurements = array_map(function ($measurement) {
                    if (!is_array($measurement)) {
                        return ['value' => $measurement, 'unit' => 'kg'];
                    }

                    return [
                        'value' => $measurement['value'] ?? $measurement,
                        'unit' => $measurement['unit'] ?? 'kg'
                    ];
                }, $measurements);
            }

            DB::table('listing_variants')->where('id', $variant->id)->update([
                'measurement' => json_encode($measurements)
            ]);
        });

        Schema::table('listing_variants', function (Blueprint $table) {
            $table->json('measurement')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('listing_variants')->whereNotNull('measurement')->get()->each(function ($variant) {
            $measurements = json_decode($variant->measurement, true);

            if (!empty($measurements) && is_array($measurements)) {
                $measurements = array_map(function ($measurementObj) {
                    return $measurementObj['value'] ?? $measurementObj;
                }, $measurements);
            }

            DB::table('listing_variants')->where('id', $variant->id)->update([
                'measurement' => json_encode($measurements)
            ]);
        });

        Schema::table('listing_variants', function (Blueprint $table) {
            $table->string('measurement')->change();
        });
    }
};
