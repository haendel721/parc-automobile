<?php

namespace App\Http\Controllers;

use App\Models\TypeVehicule;
use Illuminate\Http\Request;
use App\Models\Entretien;
use App\Models\Vehicule;
use App\Models\Marque;
use App\Models\User;
use App\Models\Carburant;
use Carbon\Carbon;
use App\Models\Assurance; // si tu as une table assurances
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userConnecter = Auth::user();
        $assurances = $userConnecter->role === 'admin'
            ? Assurance::with('vehicule')->get() // toutes les assurances pour admin
            : $userConnecter->assurances()->with('vehicule')->get();  // seulement les assurances de l'utilisateur
        // Ajouter la durée en jours pour chaque assurance
        $assurances->transform(function ($assurance) {
            $dateFin = Carbon::parse($assurance->dateFin)->startOfDay();
            $today = Carbon::today();
            // dd($dateFin , $today);
            //calcul de la duré du jour restant
            $assurance->jour_restant = $today->greaterThanOrEqualTo($dateFin)
                ? 0
                : $today->diffInDays($dateFin);

            return $assurance;
        });
        return Inertia::render('dashboard', [
            'vehicules' => Vehicule::all(),
            'entretiens' => Entretien::all(),
            'assurances' => $assurances,
            'marques' => Marque::all(),
            'typeVehicule' => TypeVehicule::all(),
            'users' => User::all(),
            'userConnecter' => $userConnecter,
            'carburant' => Carburant::all(),
        ]);
    }

    public function depensesMensuelles()
    {
        $annee = 2025; // tu peux rendre ça dynamique plus tard

        // Liste des mois
        $moisListe = [
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

        // Récupérer toutes les dépenses par véhicule et par mois
        $depenses = DB::table('vehicules')
            ->leftJoin('frais', function ($join) use ($annee) {
                $join->on('vehicules.id', '=', 'frais.vehicule_id')
                    ->whereYear('frais.created_at', $annee);
            })
            ->select(
                'vehicules.immatriculation as vehicule',
                DB::raw('MONTH(frais.created_at) as mois'),
                DB::raw('SUM(frais.montant) as total')
            )
            ->groupBy('vehicule', 'mois')
            ->get();

        // Récupérer la liste complète des véhicules
        $vehicules = DB::table('vehicules')->pluck('immatriculation');

        $data = [];

        // Construire la structure finale
        foreach ($moisListe as $numMois => $nomMois) {
            $ligne = ['mois' => $nomMois]; // clé du mois

            foreach ($vehicules as $vehicule) {
                $depenseTrouvee = $depenses->first(function ($item) use ($vehicule, $numMois) {
                    return $item->vehicule === $vehicule && $item->mois == $numMois;
                });

                $ligne[$vehicule] = $depenseTrouvee ? $depenseTrouvee->total : 0;
            }

            $data[] = $ligne;
        }

        return response()->json($data);
    }
    public function getAssurancesStatut()
    {
        $total = DB::table('assurances')->count();
        $expirees = DB::table('assurances')->where('dateFin', '<', now())->count();
        $valide = $total - $expirees;

        $result = [
            ['statut' => 'Expirées', 'count' => $expirees],
            ['statut' => 'Assurées', 'count' => $valide],
        ];

        return response()->json($result);
    }
}
