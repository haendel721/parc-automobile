<?php

namespace App\Http\Controllers;

use App\Console\Commands\UpdateAssuranceStatus;
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
    public function index(UpdateAssuranceStatus $command, EntretienController $dernierVisite)
    {
        // ✅ Exécute la logique de la commande à chaque chargement de la page
        $command->handle();
        $dernierVisite->checkDate();
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
            $assurance->jour_restant =
                $today->greaterThan($dateFin)
                ? -1
                : ($today->equalTo($dateFin)
                    ? 0
                    : $today->diffInDays($dateFin));

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
        $annee = 2025; // tu pourras rendre ça dynamique plus tard
        $user = auth()->user(); // utilisateur connecté

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

        // 🔹 Si c’est un admin : il voit toutes les dépenses
        // 🔹 Sinon : uniquement ses propres véhicules
        $vehiculesQuery = DB::table('vehicules');
        if ($user->role !== 'admin') {
            $vehiculesQuery->where('user_id', $user->id);
        }

        $vehicules = $vehiculesQuery->pluck('immatriculation', 'id');

        // Récupérer les dépenses par véhicule et par mois
        $depenses = DB::table('frais')
            ->join('vehicules', 'frais.vehicule_id', '=', 'vehicules.id')
            ->when($user->role !== 'admin', function ($query) use ($user) {
                $query->where('vehicules.user_id', $user->id);
            })
            ->whereYear('frais.created_at', $annee)
            ->select(
                'vehicules.immatriculation as vehicule',
                DB::raw('MONTH(frais.created_at) as mois'),
                DB::raw('SUM(frais.montant) as total')
            )
            ->groupBy('vehicule', 'mois')
            ->get();

        $data = [];

        // Construire le tableau final
        foreach ($moisListe as $numMois => $nomMois) {
            $ligne = ['mois' => $nomMois];

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

    public function getAssurancesStatut(Request $request)
    {
        $today = Carbon::today();
        $user = $request->user(); // utilisateur connecté

        // Si admin, on prend tous les véhicules
        if ($user->role === 'admin') {
            $vehiculesQuery = DB::table('vehicules');
        } else {
            // Sinon, seulement les véhicules de cet utilisateur
            $vehiculesQuery = DB::table('vehicules')->where('user_id', $user->id);
        }

        $vehiculesIds = $vehiculesQuery->pluck('id');

        $totalVehicules = $vehiculesIds->count();

        // Véhicules avec assurance expirée
        $expirees = DB::table('assurances')
            ->whereIn('vehicule_id', $vehiculesIds)
            ->where('dateFin', '<', $today)
            ->count();

        // Véhicules avec assurance valide
        $valide = DB::table('assurances')
            ->whereIn('vehicule_id', $vehiculesIds)
            ->where('dateFin', '>=', $today)
            ->count();

        // Véhicules sans assurance
        $sansAssurance = $totalVehicules - ($expirees + $valide);

        $result = [
            ['statut' => 'Expirées', 'count' => $expirees],
            ['statut' => 'Assurées', 'count' => $valide],
            ['statut' => 'Sans assurance', 'count' => $sansAssurance],
        ];

        return response()->json($result);
    }
}
