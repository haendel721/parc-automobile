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
            $table->unsignedInteger('diff_km_cumule')->default(0)
                ->after('kilometrique') // place la colonne juste après "kilometrage"
                ->comment('Différence cumulée de kilométrage depuis le dernier entretien');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicules', function (Blueprint $table) {
             $table->dropColumn('diff_km_cumule');
        });
    }
};
