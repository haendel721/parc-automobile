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
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation')->unique();
            $table->foreignId('marque_id')
                ->constrained('marques')
                ->onDelete('cascade');
            $table->string('model');
            $table->string('type');
            $table->string('couleur'); 
            $table->string('numSerie')->unique();
            $table->year('anneeFabrication');
            $table->date('dateAcquisition');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
