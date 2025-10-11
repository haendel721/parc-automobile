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
        Schema::table('pieces', function (Blueprint $table) {
            $table->unsignedBigInteger('vehicule_id')->nullable()->after('fournisseur_id');
            $table->foreign('vehicule_id')->references('id')->on('vehicules')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pieces', function (Blueprint $table) {
            $table->dropForeign(['vehicule_id']);
            $table->dropColumn('vehicule_id');
        });
    }
};
