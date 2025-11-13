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
        Schema::table('kilometrages', function (Blueprint $table) {
             $table->integer('difference')->default(0);
            $table->integer('cumul_avant_reinitialisation')->default(0);
            $table->boolean('a_generer_entretien')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kilometrages');
    }
};
