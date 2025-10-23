<?php

namespace App\Http\Controllers;

use App\Models\assurance;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Carburant;
use App\Models\TypeVehicule;
use App\Models\Marque;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssuranceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Récupérer les assurances selon le rôle
        $assurances = $user->role === 'admin'
            ? Assurance::with('vehicule')->get() // toutes les assurances pour admin
            : $user->assurances()->with('vehicule')->get();  // seulement les assurances de l'utilisateur
        $vehicule = Vehicule::all();
        // Ajouter la durée en jours pour chaque assurance
        $assurances->transform(function ($assurance) {
            $dateDebut = Carbon::parse($assurance->dateDebut);
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

            // Calcul de la durée en jours
            $assurance->duree_jours = $dateDebut->diffInDays($dateFin);

            return $assurance;
        });

        // Retourner les données à Inertia
        return Inertia::render('Assurances/Index', [
            'assurances' => $assurances,
            'vehicule' => $vehicule,
            'roleUser' => ['role' => $user->role],
            'flash' => session('message') ? ['message' => session('message')] : [],
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth::user();

        $vehicules = $user->role === 'admin'
            ? Vehicule::all()
            : Vehicule::where('user_id', $user->id)->get();

        return Inertia::render('Assurances/Create', [ // <-- changer Index en Create
            'vehicules' => $vehicules,
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => [
                'required',
                'exists:vehicules,id',
                'unique:assurances,vehicule_id',
            ],
            'NomCompagnie' => 'required|string|max:255',
            'NumContrat' => 'required|string|max:255|unique:assurances,NumContrat',
            'cout' => 'required|numeric',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after:dateDebut',
            'statut' =>'required|string'
        ]);
        
        Assurance::create(array_merge($validated, [
            'user_id' => auth::id(),
        ]));

        return redirect()->route('assurances.index')
            ->with('message', 'Assurance créée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Assurance $assurance)
    {
        //
    }
    public function showByVehicule($vehicule_id)
    {
        // On récupère l’assurance liée au véhicule
        $assurance = Assurance::where('vehicule_id', $vehicule_id)->first();

        if (!$assurance) {
            abort(404, 'Aucune assurance trouvée pour ce véhicule');
        }

        // On récupère aussi les infos du véhicule
        $vehicule = Vehicule::find($vehicule_id);

        return Inertia::render('Assurances/Show', [
            'assurance' => $assurance,
            'vehicule' => $vehicule,
        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Assurance $assurance)
    {
        return Inertia::render('Assurances/Edit', [
            'assurance' => $assurance,
            'Vehicule' => Vehicule::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Assurance $assurance)
    {
        $data = $request->validate([
            'vehicule_id' => [
                'required',
                'exists:vehicules,id',
            ],
            'NomCompagnie' => 'required|string|max:255',
            'NumContrat' => 'required|string|max:255',
            'cout' => 'required|numeric',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after:dateDebut',
        ]);
        // dd($data);
        $assurance->update($data);

        return redirect()->route('assurances.index')->with('message', 'Assurance mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assurance $assurance)
    {
        $assurance->delete();
        return redirect()->route('assurances.index')->with('message', 'Assurance supprimé avec succès.');
    }
}
