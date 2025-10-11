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
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('entretien_id');
            $table->unsignedBigInteger('piece_id')->nullable();
            $table->decimal('main_oeuvre', 10, 2)->nullable();
            $table->integer('kilometrage')->nullable();
            $table->string('description')->nullable();
            $table->string('duree_immobilisation')->nullable();
            $table->timestamps();

            // Clés étrangères
            $table->foreign('entretien_id')->references('id')->on('entretiens')->onDelete('cascade');
            $table->foreign('piece_id')->references('id')->on('pieces')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
