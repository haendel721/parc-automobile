<?php

namespace App\Console\Commands;

use App\Models\Vehicule;
use Illuminate\Console\Command;

class RecommenderEntretien5000km extends Command
{
    protected $signature = 'vehicules:verifier-kilometrage';
    protected $description = 'Vérifie et met à jour le kilométrage de tous les véhicules';

    public function handle()
    {
        $vehicules = Vehicule::with(['kilometrages', 'interventions'])->get();
        
        $this->info("🔍 Vérification de {$vehicules->count()} véhicules...");

        $bar = $this->output->createProgressBar($vehicules->count());

        foreach ($vehicules as $vehicule) {
            try {
                $ancienKm = $vehicule->kilometrique;
                $nouveauKm = $vehicule->recalculerKilometrage();
                
                if ($ancienKm != $nouveauKm) {
                    $this->line("\n🔄 Véhicule {$vehicule->immatriculation}: {$ancienKm}km → {$nouveauKm}km");
                }
                
            } catch (\Exception $e) {
                $this->error("\n❌ Erreur avec le véhicule {$vehicule->immatriculation}: " . $e->getMessage());
            }
            
            $bar->advance();
        }

        $bar->finish();
        $this->info("\n✅ Vérification terminée !");

        return Command::SUCCESS;
    }
}