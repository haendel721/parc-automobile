<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('marques')->insert([
            ['nom' => 'Toyota'],
            ['nom' => 'Peugeot'],
            ['nom' => 'Renault'],
            ['nom' => 'Mercedes-Benz'],
            ['nom' => 'BMW'],
            ['nom' => 'Audi'],
            ['nom' => 'Volkswagen'],
            ['nom' => 'Ford'],
            ['nom' => 'Nissan'],
            ['nom' => 'Hyundai'],
        ]);
    }
}
