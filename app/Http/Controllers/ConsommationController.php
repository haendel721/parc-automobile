<?php

namespace App\Http\Controllers;

use App\Models\pleinCarburant;
use App\Services\PleinCarburantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConsommationController extends Controller
{
    protected $pleinCarburantService;

    public function __construct(PleinCarburantService $pleinCarburantService)
    {
        $this->pleinCarburantService = $pleinCarburantService;
    }

    public function index(Request $request)
    {
        try {
            // 1. Récupérer l'utilisateur connecté
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié',
                    'weeksData' => []
                ], 401);
            }

            // 2. Récupérer tous les véhicules de l'utilisateur
            $vehicules = $user->vehicules ?? [];

            // 3. Préparer les données de consommation
            $weeksDataAll = [];

            foreach ($vehicules as $vehicule) {
                try {
                    $weeksData = $this->pleinCarburantService->getWeeklyConsumption($vehicule->id);

                    // CORRECTION : Vérifier que $weeksData est un tableau et itérer correctement
                    if (is_array($weeksData)) {
                        foreach ($weeksData as $weekData) {
                            // CORRECTION : Ajouter les informations du véhicule à chaque élément de semaine
                            $weekData['vehicule_id'] = $vehicule->id;
                            $weekData['vehicule_nom'] = $vehicule->immatriculation ?? "Véhicule {$vehicule->id}";
                            $weeksDataAll[] = $weekData;
                        }
                    }
                } catch (\Exception $e) {
                    // Log l'erreur pour ce véhicule mais continuer avec les autres
                    \Log::error("Erreur pour le véhicule {$vehicule->id}: " . $e->getMessage());
                    continue;
                }
            }

            // 4. Retourner en JSON
            return response()->json([
                'success' => true,
                'weeksData' => $weeksDataAll,
                'total' => count($weeksDataAll)
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans ConsommationController@index: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors du chargement des données',
                'error' => $e->getMessage(),
                'weeksData' => []
            ], 500);
        }
    }
    public function getConsommationData(): JsonResponse
    {
        try {
            // 🔹 Récupérer tous les pleins de carburant avec les véhicules associés
            $pleins = pleinCarburant::with('vehicule')
                ->select([
                    'vehicule_id',
                    'date_plein',
                    'quantite',
                    'kilometrage',
                    DB::raw('YEAR(date_plein) as annee'),
                    DB::raw('WEEK(date_plein, 1) as semaine') // Semaine commençant le lundi
                ])
                ->whereNotNull('kilometrage')
                ->orderBy('date_plein')
                ->get();

            if ($pleins->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'weeksData' => [],
                    'total' => 0,
                    'message' => 'Aucune donnée de consommation disponible'
                ]);
            }

            // 🔹 Grouper par véhicule et par semaine
            $groupedData = [];

            foreach ($pleins as $plein) {
                $vehiculeId = $plein->vehicule_id;
                $weekKey = $plein->annee . '-W' . str_pad($plein->semaine, 2, '0', STR_PAD_LEFT);

                if (!isset($groupedData[$vehiculeId])) {
                    $groupedData[$vehiculeId] = [];
                }

                if (!isset($groupedData[$vehiculeId][$weekKey])) {
                    $groupedData[$vehiculeId][$weekKey] = [
                        'vehicule_id' => $vehiculeId,
                        'vehicule_nom' => $plein->vehicule->immatriculation ?? 'Inconnu',
                        'week' => $weekKey,
                        'litres' => 0,
                        'km' => 0,
                        'consommation' => 0
                    ];
                }

                // 🔹 Accumuler les litres et le kilométrage
                $groupedData[$vehiculeId][$weekKey]['litres'] += $plein->quantite;
                $groupedData[$vehiculeId][$weekKey]['km'] += $plein->kilometrage;
            }

            // 🔹 Calculer la consommation pour chaque semaine (L/100km)
            $weeksData = [];

            foreach ($groupedData as $vehiculeWeeks) {
                foreach ($vehiculeWeeks as $weekData) {
                    if ($weekData['km'] > 0) {
                        $weekData['consommation'] = ($weekData['litres'] / $weekData['km']) * 100;
                    }

                    // S'assurer que toutes les clés sont présentes et bien formatées
                    $weeksData[] = [
                        'week' => (string) $weekData['week'],
                        'litres' => (float) $weekData['litres'],
                        'km' => (float) $weekData['km'],
                        'consommation' => (float) $weekData['consommation'],
                        'vehicule_id' => (int) $weekData['vehicule_id'],
                        'vehicule_nom' => (string) $weekData['vehicule_nom']
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'weeksData' => $weeksData,
                'total' => count($weeksData),
                'message' => 'Données récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans ConsommationController: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'weeksData' => [],
                'total' => 0,
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Version alternative avec requête directe comme votre exemple
     */
    /**
     * Méthode de débogage
     */
    public function debugData()
    {
        $user = auth()->user();

        // Compter les pleins par véhicule
        $pleinsCount = PleinCarburant::where('user_id', $user->id)
            ->select('vehicule_id', DB::raw('COUNT(*) as count'))
            ->groupBy('vehicule_id')
            ->get();

        // Véhicules de l'utilisateur
        $vehicules = $user->vehicules;

        return response()->json([
            'user_id' => $user->id,
            'vehicules_count' => $vehicules->count(),
            'pleins_par_vehicule' => $pleinsCount,
            'vehicules_list' => $vehicules->pluck('immatriculation', 'id')
        ]);
    }
    public function consommationJson()
    {
        // 🔐 Récupérer l'utilisateur connecté
        $user = auth()->user();

        // 🔎 Construire la requête avec regroupement par semaine
        $query = DB::table('plein_carburants')
            ->join('vehicules', 'plein_carburants.vehicule_id', '=', 'vehicules.id')
            ->select(
                'plein_carburants.vehicule_id',
                DB::raw('YEAR(plein_carburants.date_plein) as annee'),
                DB::raw('WEEK(plein_carburants.date_plein, 1) as semaine'),
                DB::raw('MONTH(plein_carburants.date_plein) as mois'),
                DB::raw('SUM(plein_carburants.quantite) as total_litres'),
                DB::raw('SUM(plein_carburants.montant_total) as total_montant'),
                DB::raw('AVG(plein_carburants.prix_litre) as prix_litre_moyen'),
                'vehicules.immatriculation',
                'vehicules.model'
            )
            ->groupBy(
                'plein_carburants.vehicule_id',
                'vehicules.immatriculation',
                'vehicules.model',
                'annee',
                'semaine',
                'mois'
            )
            ->orderBy('plein_carburants.vehicule_id')
            ->orderBy('annee')
            ->orderBy('semaine');

        // 🧑‍💼 Si ce n'est pas un admin, filtrer les résultats selon l'utilisateur
        if ($user->role !== 'admin') {
            $query->where('plein_carburants.user_id', $user->id);
        }

        // 🚀 Exécuter la requête
        $data = $query->get();

        // 📅 Tableau des mois en français
        $moisNoms = [
            1 => 'Janvier',
            2 => 'Février',
            3 => 'Mars',
            4 => 'Avril',
            5 => 'Mai',
            6 => 'Juin',
            7 => 'Juillet',
            8 => 'Août',
            9 => 'Septembre',
            10 => 'Octobre',
            11 => 'Novembre',
            12 => 'Décembre'
        ];

        // 🧮 Ajouter le label "Mois - Semaine - Année" et calculer la consommation
        $data->transform(function ($item) use ($moisNoms) {
            $moisNom = $moisNoms[$item->mois] ?? 'Inconnu';
            $item->periode = "Semaine {$item->semaine} - {$item->annee} ({$moisNom})";
            $item->week = "{$item->annee}-W{$item->semaine}";

            // Vous pouvez ajouter d'autres calculs ici si nécessaire
            // Par exemple, si vous avez les kilométrages dans une autre table
            $item->consommation = 0; // À calculer selon votre logique métier

            return $item;
        });

        // 📤 Retourner les données formatées
        return response()->json([
            'success' => true,
            'data' => $data,
            'total' => $data->count()
        ]);
    }
}
