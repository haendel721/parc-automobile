<?php

namespace App\Http\Controllers;

use App\Models\pleinCarburant;
use App\Models\Carburant;
use App\Models\Vehicule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PleinCarburantController extends Controller
{
    public function index()
    {
        $user = Auth()->user();
        $T_user = User::all();
        $vehicules = $user->role === 'admin' ?
            Vehicule::all()
            : Vehicule::where('user_id', $user->id)->get();
        $pleinCarburant = $user->role === 'admin' ?
            pleinCarburant::with(['vehicule', 'user'])->latest()->get()
            : pleinCarburant::with(['vehicule', 'user'])->where('user_id', $user->id)->get();
        $montantTotal = PleinCarburant::select(
            'vehicule_id',
            DB::raw('SUM(montant_total) as totalMontant')
        )
            ->groupBy('vehicule_id')
            ->with('vehicule')
            ->get();
        $quantite = PleinCarburant::select(
            'vehicule_id',
            DB::raw('SUM(quantite) as Quantite')
        )
            ->groupBy('vehicule_id')
            ->with('vehicule')
            ->get();
        return inertia('PleinCarburants/Index', [
            'pleinCarburant' => $pleinCarburant,
            'user' => $user,
            'montantTotal' => $montantTotal,
            'Quantite' => $quantite,
            'vehicules' => $vehicules,
            'T_user' => $T_user,
        ]);
    }

    public function create()
    {
        $user = Auth()->user();
        $vehicules = $user->role === 'admin' ? Vehicule::all() : Vehicule::where('user_id', $user->id)->get();
        return inertia('PleinCarburants/Create', [
            'vehicules' => $vehicules,
            'user' => $user,
            'carburants' => Carburant::all(),
        ]);
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'vehicule_id' => 'required',
    //         'date_plein' => 'required|date',
    //         'quantite' => 'required|numeric|min:0',
    //         'station' => 'nullable|string|max:255',
    //         'prix_unitaire' => 'required',
    //         'montant_total' => 'required',
    //     ]);

    //     $validated['user_id'] = auth()->id();

    //     // Récupérer le véhicule sélectionné
    //     $vehicule = Vehicule::find($validated['vehicule_id']);

    //     // Vérifier la capacité du réservoir
    //     if ($validated['quantite'] > $vehicule->capacite_reservoir) {
    //         return back()->withErrors([
    //             'quantite' => "La quantité saisie ({$validated['quantite']} L) dépasse la capacité du réservoir ({$vehicule->capacite_reservoir} L).",
    //         ])->withInput();
    //     }
    //     pleinCarburant::create($validated);

    //     return redirect()->route('pleinCarburant.index')->with('success', 'Plein carburant ajouté avec succès.');
    // }
    public function destroy(pleinCarburant $pleinCarburant)
    {
        // dd($pleinCarburant);
        $pleinCarburant->delete();

        return redirect()->route('pleinCarburant.index')
            ->with('message', 'plein supprimée avec succès.');
    }
    public function grapheVariationPleinCarburantParVehicule()
    {
        // 🔐 Récupérer l'utilisateur connecté
        $user = auth()->user();

        // 🔎 Construire la requête avec regroupement par semaine
        $query = DB::table('plein_carburants')
            ->join('vehicules', 'plein_carburants.vehicule_id', '=', 'vehicules.id')
            ->select(
                'plein_carburants.vehicule_id',
                DB::raw('YEAR(plein_carburants.date_plein) as annee'),
                DB::raw('WEEK(plein_carburants.date_plein, 1) as semaine'), // semaine ISO (lundi = 1)
                DB::raw('MONTH(plein_carburants.date_plein) as mois'),
                DB::raw('SUM(plein_carburants.montant_total) as total_hebdomadaire'),
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

        // 🧮 Ajouter le label "Mois - Semaine - Année"
        $data->transform(function ($item) use ($moisNoms) {
            $moisNom = $moisNoms[$item->mois] ?? 'Inconnu';
            $item->periode = "Semaine {$item->semaine} - {$item->annee} ({$moisNom})";
            return $item;
        });

        // 📤 Retourner les données formatées
        return response()->json($data);
    }





    // Récupérer les données d'un véhicule spécifique
    public function grapheOnePleinCarburant($vehicule_id)
    {
        $data = PleinCarburant::where('vehicule_id', $vehicule_id)
            ->select('date_plein', 'quantite', 'montant_total')
            ->orderBy('date_plein')
            ->get();

        return response()->json($data);
    }
}
