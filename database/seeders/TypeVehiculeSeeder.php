<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeVehiculeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('type_vehicules')->insert([
            ['nom' => 'Berline'],
            ['nom' => 'SUV'],
            ['nom' => 'Coupé'],
            ['nom' => 'Cabriolet'],
            ['nom' => 'Break'],
            ['nom' => 'Monospace'],
            ['nom' => 'Utilitaire'],
            ['nom' => 'Pick-up'],
            ['nom' => 'Fourgonnette'],
            ['nom' => 'Minibus'],
        ]);
    }
}
