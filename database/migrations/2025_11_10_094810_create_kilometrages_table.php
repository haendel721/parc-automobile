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
        Schema::create('kilometrages', function (Blueprint $table) {
            $table->id();
            $table->date('date_releve'); 
            $table->integer('kilometrage'); 
            $table->enum('type_releve', ['normal', 'vidange'])->default('normal'); 
            $table->foreignId('vehicule_id') 
                ->constrained('vehicules')
                ->onDelete('cascade');
            $table->timestamps();
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
