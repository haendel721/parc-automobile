<?php

namespace App\Http\Controllers;

use App\Services\PleinCarburantService;
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

                    foreach ($weeksData as $week) {
                        $week['vehicule_id'] = $vehicule->id;
                        $week['vehicule_nom'] = $vehicule->immatriculation ?? "Véhicule {$vehicule->id}";
                        $weeksDataAll[] = $week;
                    }
                } catch (\Exception $e) {
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
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors du chargement des données',
                'error' => $e->getMessage(),
                'weeksData' => []
            ], 500);
        }
    }

    /**
     * Version alternative avec requête directe comme votre exemple
     */
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