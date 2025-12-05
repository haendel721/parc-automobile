<?php

namespace App\Http\Controllers;

use App\Models\Kilometrage;
use App\Models\Vehicule;
use App\Models\Entretien;
use App\Models\pleinCarburant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Notifications\NotifyEntretien5000km;

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
            return redirect()->route('vehicules.index')->with('message', "Erreur lors du chargement des relevés");
            // return response()->json([
            //     'success' => false,
            //     'error' => 'Erreur lors du chargement des relevés',
            //     'data' => []
            // ], 500);
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
                // return response()->json([
                //     'success' => false,
                //     'error' => 'Véhicule non trouvé'
                // ], 404);
                return redirect()->route('vehicules.index')->with('message', "Véhicule non trouvé");
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
                // return response()->json([
                //     'success' => false,
                //     'error' => "Le kilométrage saisi ({$request->kilometrage}) est inférieur à la référence ({$referenceKilometrage})."
                // ], 422);

                return redirect()->route('vehicules.index')->with('message', "Le kilométrage saisi ({$request->kilometrage}) est inférieur à la référence ({$referenceKilometrage}).");
            }

            // 4️⃣ Calcul de la différence
            $difference = $request->kilometrage - $referenceKilometrage;

            // 5️⃣ Mise à jour du cumul
            $nouveauCumul = ($vehicule->releve_km_cumule ?? 0) + $difference;
            $cumulAvantReinitialisation = $nouveauCumul;

            // 6️⃣ Vérification entretien
            $aGenererEntretien = false;
            $seuilEntretien = 5000;
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
            if ($nouveauCumul >= $seuilEntretien) {
                $aGenererEntretien = true;
                // Déclencher la notification
                $this->declencherNotificationEntretien($vehicule, $nouveauCumul, $kilometrage);

                // Créer l'entretien si nécessaire
                $this->creerEntretien($vehicule, $request->kilometrage);
                $nouveauCumul = 0; // Réinitialisation
            }



            // Debug après création
            // dd('Relevé créé:', $kilometrage);

            // 8️⃣ Mise à jour du véhicule
            $vehicule->update([
                'kilometrique' => $request->kilometrage,
                'releve_km_cumule' => $nouveauCumul
            ]);

            DB::commit();

            // return response()->json([
            //     'success' => true,
            //     'message' => '✅ Relevé enregistré avec succès',
            //     'data' => $kilometrage,
            //     'cumul_total' => $cumulAvantReinitialisation,
            //     'nouveau_cumul' => $nouveauCumul,
            //     'entretien_genere' => $aGenererEntretien
            // ]);
            return redirect()->route('vehicules.index')->with('message', 'Relevé enregistré avec succès');
        } catch (\Exception $e) {
            DB::rollBack();

            // Debug en cas d'erreur
            dd('Erreur:', $e->getMessage());

            return redirect()->route('vehicules.index')->with('message', 'Erreur lors de l\'enregistrement du relevé');
            // return response()->json([
            //     'success' => false,
            //     'error' => 'Erreur lors de l\'enregistrement du relevé: ' . $e->getMessage()
            // ], 500);
        }
    }
    public function kmCarburantStore(Request $request)
    {
        // Validation des données pour le plein de carburant
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'date_plein' => 'required|date',
            'quantite' => 'required|numeric|min:0',
            'station' => 'nullable|string|max:255',
            'prix_unitaire' => 'required',
            'montant_total' => 'required',
            'date_releve' => 'required|date',
            'kilometrage' => 'required|integer|min:0',
            'kmCarburant' => 'required|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Ajouter l'ID de l'utilisateur authentifié
            $validated['user_id'] = auth()->id();

            // Récupérer le véhicule sélectionné
            $vehicule = Vehicule::find($validated['vehicule_id']);
            // if (!$vehicule) {
            //     return redirect()->route('vehicules.index')->with('message', "Véhicule non trouvé");
            // }

            // 1. VÉRIFICATION CAPACITÉ RÉSERVOIR
            if ($validated['quantite'] > $vehicule->capacite_reservoir) {
                return back()->withErrors([
                    'quantite' => "La quantité saisie ({$validated['quantite']} L) dépasse la capacité du réservoir ({$vehicule->capacite_reservoir} L).",
                ])->withInput();
            } else if ($validated['quantite'] <= 0) {
                return back()->withErrors([
                    'quantite' => "La quantité saisie ne doit pas être inférieur ou égal à 0.",
                ])->withInput();
            }

            // 2. CRÉATION DU PLEIN DE CARBURANT
            $pleinCarburant = pleinCarburant::create([
                'vehicule_id' => $validated['vehicule_id'],
                'user_id' => $validated['user_id'],
                'date_plein' => $validated['date_plein'],
                'quantite' => $validated['quantite'],
                'station' => $validated['station'],
                'prix_unitaire' => $validated['prix_unitaire'],
                'montant_total' => $validated['montant_total'],
            ]);

            // 3. GESTION DU RELEVÉ KILOMÉTRIQUE
            // Récupération du dernier relevé
            $dernierReleve = Kilometrage::where('vehicule_id', $validated['vehicule_id'])
                ->orderBy('date_releve', 'desc')
                ->orderBy('created_at', 'desc')
                ->first();

            // Vérification de cohérence du kilométrage
            $referenceKilometrage = $dernierReleve ? $dernierReleve->kilometrage : ($vehicule->kilometrique ?? 0);

            if ($validated['kilometrage'] < $referenceKilometrage) {
                return back()->withErrors([
                    'kilometrage' => "Le kilométrage saisi ({$validated['kilometrage']}) est inférieur à la référence ({$referenceKilometrage}).",
                ])->withInput();
            }
            // else if ($validated['kilometrage'] == $referenceKilometrage) {
            //     return back()->withErrors([
            //         'kilometrage' => "Le kilométrage saisi ne doit pas être égal à ({$referenceKilometrage}).",
            //     ])->withInput();
            // }

            // Calcul de la différence
            $difference = $validated['kilometrage'] - $referenceKilometrage;
           
            // Mise à jour du cumul
            $nouveauCumul = ($vehicule->releve_km_cumule ?? 0) + $difference;
             
            $cumulAvantReinitialisation = $nouveauCumul;

            // Vérification entretien
            $aGenererEntretien = false;
            $seuilEntretien = 5000;
            
            // Création du relevé kilométrique
            $kilometrage = Kilometrage::create([
                'vehicule_id' => $validated['vehicule_id'],
                'user_id' => $validated['user_id'],
                'date_releve' => $validated['date_releve'],
                'kilometrage' => $validated['kilometrage'],
                // 'kmCarburant' => $validated['kmCarburant'],
                'difference' => $difference,
                'cumul_avant_reinitialisation' => $cumulAvantReinitialisation,
                'a_generer_entretien' => $aGenererEntretien
            ]);
            // dd($kilometrage);

            // Gestion de l'entretien si le seuil est atteint
            if ($nouveauCumul >= $seuilEntretien) {
                $aGenererEntretien = true;

                // Mettre à jour le relevé avec le flag d'entretien
                $kilometrage->update(['a_generer_entretien' => true]);

                // Déclencher la notification
                $this->declencherNotificationEntretien($vehicule, $nouveauCumul, $kilometrage);

                // Créer l'entretien
                $this->creerEntretien($vehicule, $validated['kilometrage']);

                $nouveauCumul = 0; // Réinitialisation
            }

            // Mise à jour du véhicule
            $vehicule->update([
                'kilometrique' => $validated['kilometrage'],
                'releve_km_cumule' => $nouveauCumul
            ]);

            DB::commit();
            return redirect()->route('pleinCarburant.index')->with('success', 'Plein carburant et relevé kilométrique ajoutés avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Erreur lors de l\'enregistrement: ' . $e->getMessage())->withInput();
        }
    }
    /**
     * Déclenche la notification d'entretien 5000km
     */
    private function declencherNotificationEntretien(Vehicule $vehicule, $kilometrageCumule, Kilometrage $kilometrage)
    {
        try {
            // Mettre à jour les données du véhicule pour la notification
            $vehicule->refresh(); // Recharger les données fraîches

            // Notifier les utilisateurs concernés (ex: administrateurs, responsables flotte)
            $usersANotifier = $this->getUsersANotifier();

            foreach ($usersANotifier as $user) {
                $user->notify(new NotifyEntretien5000km($vehicule, $kilometrageCumule, $kilometrage));
            }

            // Alternative: Notification via facade
            // Notification::send($usersANotifier, new NotifyEntretien5000km($vehicule));

        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi de la notification d\'entretien: ' . $e->getMessage());
        }
    }
    private function getUsersANotifier()
    {
        // Exemple: notifier les administrateurs et responsables flotte
        // return \App\Models\User::whereHas('roles', function($query) {
        //     $query->whereIn('name', ['admin', 'responsable_flotte', 'superviseur']);
        // })->get();

        // Alternative: notifier un utilisateur spécifique
        return \App\Models\User::where('id', auth()->id())->get();
    }
    // private function creerEntretien(Vehicule $vehicule, $kilometrageActuel)
    // {
    //     Entretien::create([
    //         'vehicule_id' => $vehicule->id,
    //         'type_entretien' => 'Maintenance périodique',
    //         'user_id' => auth()->id(),
    //         'date_entretien' => Carbon::now(),
    //         'kilometrage_entretien' => $kilometrageActuel,
    //         'prochaine_visite' => Carbon::now()->addMonths(6),
    //         'kilometrage_prochaine_visite' => $kilometrageActuel + 5000,
    //         'statut' => 'programmé',
    //         'notes' => 'Entretien généré automatiquement - Seuil de 5000 km atteint'
    //     ]);
    // }
}
