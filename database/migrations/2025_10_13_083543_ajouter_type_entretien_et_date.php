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
        Schema::table('entretien_validateds', function (Blueprint $table) {
            $table->string('type_entretien')->nullable()->after('id');
            $table->date('date_prevue')->after('type_entretien');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entretien_validateds', function (Blueprint $table) {
            //
        });
    }
};
