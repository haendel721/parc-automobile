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
        Schema::table('entretiens', function (Blueprint $table) {
             // Relations
            $table->foreignId('vehicule_id')->constrained('vehicules')->onDelete('cascade');
            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->nullOnDelete();
            
            // Champs de l'entretien
            $table->string('type')->nullable();
            $table->integer('cout')->default(0);
            $table->string('piece_remplacee')->nullable();
            $table->string('probleme')->nullable();
            $table->string('recommandation')->nullable();
            $table->date('prochaine_visite')->nullable();
            $table->text('description')->nullable();
            $table->date('dernier_visite')->nullable();
            $table->date('derniere_vidange')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entretiens', function (Blueprint $table) {
            //
        });
    }
};
