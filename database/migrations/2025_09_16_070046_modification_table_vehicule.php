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
        Schema::table('vehicules', function (Blueprint $table) {
             $table->foreignId('carburant_id')
                ->constrained('carburants')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicule', function (Blueprint $table) {
            $table->string('carburant_id')->change();
        });
    }
};
