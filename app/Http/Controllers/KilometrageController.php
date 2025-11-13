<?php

namespace App\Http\Controllers;

use App\Models\Kilometrage;
use App\Models\Vehicule;
use App\Models\Entretien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KilometrageController extends Controller
{
    // Récupérer l'historique des kilométrages d'un véhicule
    public function index(Vehicule $vehicule)
    {
        try {
            $kilometrages = Kilometrage::with('user')
                ->where('vehicule_id', $vehicule->id)
                ->orderBy('date_releve', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $kilometrages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors du chargement des relevés',
                'data' => []
            ], 500);
        }
    }

    // Récupérer le dernier relevé d'un véhicule
    public function dernierReleve(Vehicule $vehicule)
    {
        $dernierReleve = Kilometrage::with('user')
            ->where('vehicule_id', $vehicule->id)
            ->orderBy('date_releve', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json($dernierReleve);
    }

    // Enregistrer un nouveau relevé kilométrique
    public function store(Request $request)
    {
        // Debug des données reçues
        // dd('Données reçues:', $request->all());

        $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'user_id' => 'required|exists:users,id',
            'date_releve' => 'required|date',
            'kilometrage' => 'required|integer|min:0'
        ]);

        try {
            DB::beginTransaction();

            // 1️⃣ Récupération du véhicule
            $vehicule = Vehicule::find($request->vehicule_id);
            if (!$vehicule) {
                return response()->json([
                    'success' => false,
                    'error' => 'Véhicule non trouvé'
                ], 404);
            }

            // 2️⃣ Récupération du dernier relevé
            $dernierReleve = Kilometrage::where('vehicule_id', $request->vehicule_id)
                ->orderBy('date_releve', 'desc')
                ->orderBy('created_at', 'desc')
                ->first();

            // Debug du dernier relevé
            // dd('Dernier relevé trouvé:', $dernierReleve, 'Véhicule:', $vehicule);

            // 3️⃣ Vérification de cohérence
            $referenceKilometrage = $dernierReleve ? $dernierReleve->kilometrage : ($vehicule->kilometrique ?? 0);

            if ($request->kilometrage < $referenceKilometrage) {
                return response()->json([
                    'success' => false,
                    'error' => "Le kilométrage saisi ({$request->kilometrage}) est inférieur à la référence ({$referenceKilometrage})."
                ], 422);
            }

            // 4️⃣ Calcul de la différence
            $difference = $request->kilometrage - $referenceKilometrage;

            // 5️⃣ Mise à jour du cumul
            $nouveauCumul = ($vehicule->releve_km_cumule ?? 0) + $difference;
            $cumulAvantReinitialisation = $nouveauCumul;

            // 6️⃣ Vérification entretien
            $aGenererEntretien = false;
            $seuilEntretien = 5000;

            if ($nouveauCumul >= $seuilEntretien) {
                $aGenererEntretien = true;
                $this->creerEntretien($vehicule, $request->kilometrage);
                // dd('Entretien généré pour le véhicule ID ' . $vehicule->id);
                $nouveauCumul = 0; // Réinitialisation
            }

            // 7️⃣ Enregistrement du relevé
            $kilometrage = Kilometrage::create([
                'vehicule_id' => $request->vehicule_id,
                'user_id' => $request->user_id,
                'date_releve' => $request->date_releve,
                'kilometrage' => $request->kilometrage,
                'difference' => $difference,
                'cumul_avant_reinitialisation' => $cumulAvantReinitialisation,
                'a_generer_entretien' => $aGenererEntretien
            ]);

            // Debug après création
            // dd('Relevé créé:', $kilometrage);

            // 8️⃣ Mise à jour du véhicule
            $vehicule->update([
                'kilometrique' => $request->kilometrage,
                'releve_km_cumule' => $nouveauCumul
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => '✅ Relevé enregistré avec succès',
                'data' => $kilometrage,
                'cumul_total' => $cumulAvantReinitialisation,
                'nouveau_cumul' => $nouveauCumul,
                'entretien_genere' => $aGenererEntretien
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Debug en cas d'erreur
            dd('Erreur:', $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors de l\'enregistrement du relevé: ' . $e->getMessage()
            ], 500);
        }
    }

    private function creerEntretien(Vehicule $vehicule, $kilometrageActuel)
    {
        Entretien::create([
            'vehicule_id' => $vehicule->id,
            'type_entretien' => 'Maintenance périodique',
            'user_id'=> auth()->id(),
            'date_entretien' => Carbon::now(),
            'kilometrage_entretien' => $kilometrageActuel,
            'prochaine_visite' => Carbon::now()->addMonths(6),
            'kilometrage_prochaine_visite' => $kilometrageActuel + 5000,
            'statut' => 'programmé',
            'notes' => 'Entretien généré automatiquement - Seuil de 5000 km atteint'
        ]);
    }
}