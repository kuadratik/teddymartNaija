<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateVariantSizeToObjects extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {



        DB::table('listing_variants')->whereNotNull('size')->get()->each(function ($variant) {
            $sizes = json_decode($variant->size, true);

            if (!empty($sizes) && is_array($sizes)) {
                $sizes = array_map(function ($size) {
                    return ['size' => $size, 'unit' => 'kg'];
                }, $sizes);
            }

            DB::table('listing_variants')->where('id', $variant->id)->update([
                'size' => json_encode($sizes)
            ]);
        });

        Schema::table('listing_variants', function (Blueprint $table) {
            $table->json('size')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listing_variants', function (Blueprint $table) {
            $table->string('size')->change();
        });

        DB::table('listing_variants')->whereNotNull('size')->get()->each(function ($variant) {
            $sizes = json_decode($variant->size, true);

            if (!empty($sizes) && is_array($sizes)) {
                $sizes = array_map(function ($sizeObj) {
                    return $sizeObj['size'];
                }, $sizes);
            }

            DB::table('listing_variants')->where('id', $variant->id)->update([
                'size' => json_encode($sizes)
            ]);
        });
    }
}
