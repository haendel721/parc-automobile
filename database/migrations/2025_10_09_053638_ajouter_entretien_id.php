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
        Schema::table('frais', function (Blueprint $table) {
            $table->unsignedBigInteger('entretien_id')->nullable()->after('id');
            $table->foreign('entretien_id')->references('id')->on('entretiens')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frais', function (Blueprint $table) {
            //
        });
    }
};
