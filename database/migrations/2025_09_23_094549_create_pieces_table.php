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
        Schema::create('pieces', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // nom de la pièce
            $table->decimal('prix', 10, 2); // prix de la pièce
            $table->integer('quantite'); // quantité en stock
            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->nullOnDelete(); // lien vers fournisseur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pieces');
    }
};
