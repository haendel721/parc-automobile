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
        Schema::create('entretien_validateds', function (Blueprint $table) {
            $table->id();

            // user_id : référence la colonne user_id dans entretiens
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('user_id')->on('entretiens')->onDelete('set null');

            // entretien_id
            $table->foreignId('entretien_id')->constrained('entretiens')->onDelete('cascade');

            // vehicule_id
            $table->unsignedBigInteger('vehicule_id')->nullable();
            $table->foreign('vehicule_id')->references('vehicule_id')->on('entretiens')->onDelete('set null');


            // mecanicien_id : référence la colonne mecanicien_id dans entretiens
            $table->unsignedBigInteger('mecanicien_id')->nullable();
            $table->foreign('mecanicien_id')->references('mecanicien_id')->on('entretiens')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entretien_validateds');
    }
};
