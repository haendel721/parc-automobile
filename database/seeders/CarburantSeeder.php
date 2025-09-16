<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarburantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('carburants')->insert([
            ['type' => 'Essence'],
            ['type' => 'Diesel'],
            ['type' => 'Gaz de pétrole liquéfié'],
            ['type' => 'Electrique'],
            ['type' => 'Hybride essence/électrique'],
            ['type' => 'Hybride diesel/électrique'],
            ['type' => 'Hydrogène'],
        ]);
    }
}
