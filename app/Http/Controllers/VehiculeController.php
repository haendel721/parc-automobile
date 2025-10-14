<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Carburant;
use App\Models\TypeVehicule;
use App\Models\Marque;
use App\Models\Intervention;
use App\Models\User;
use App\Models\entretien;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class VehiculeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vehicules = Auth::user()->role === 'admin'
            ? Vehicule::with('assurance')->get() // <-- Charger la relation assurance
            : Auth::user()->vehicules()->with('assurance')->get();
        $intervention = Intervention::all();
        $entretien = Entretien::all();
        return Inertia::render('Vehicules/Index', [
            'vehicules' => $vehicules,
            'roleUser' => ['role' => Auth::user()->role],
            'carburants' => Carburant::all(),
            'typeVehicules' => TypeVehicule::all(),
            'marques' => Marque::all(),
            'userNames' => User::pluck('name', 'id'),
            'intervention' => $intervention,
            'entretien' =>$entretien,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $carburants = Carburant::all(); // récupère tous les carburants
        $typesVehicules = TypeVehicule::all(); // récupère tous les types de véhicules
        $marques = Marque::all(); // récupère tous les marque de vehicules
        return Inertia::render('Vehicules/Create', [
            'carburants' => $carburants,
            'typesVehicules' => $typesVehicules,
            'marques' => $marques
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'immatriculation' => 'required|string|max:255|unique:vehicules,immatriculation',
            'marque_id' => 'required|exists:marques,id',
            'model' => 'required|string|max:255',
            'typeVehicule_id' => 'required|exists:type_vehicules,id',
            'couleur' => 'required|string|max:100',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // optionnel
            'carburant_id' => 'required|exists:carburants,id',
            'numSerie' => 'nullable|string|max:255',
            'anneeFabrication' => 'nullable|integer|min:1900|max:' . date('Y'),
            'dateAcquisition' => 'nullable|date',
        ]);

        // Ajouter l'utilisateur connecté automatiquement
        $data['user_id'] = Auth::id();
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos_voitures', 'public');
            $data['photo'] = $photoPath;
        }
        // dd($data);

        Vehicule::create($data);
        return redirect()->route('vehicules.index')->with('message', 'vehicule ajouter avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicule $vehicules)
    {
        $userConnecter = Auth::user()->role;

        // Récupérer l'assurance du véhicule
        $assurance = $vehicules->assurance;
        $vehicules = Vehicule::with('assurance')->get();

        return Inertia::render('Vehicules/Show', [
            'vehicules' => $vehicules,
            'assurance' => $assurance,
            'userConnecter' => $userConnecter,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicule $Vehicule)
    {
        $carburants = Carburant::all(); // récupère tous les carburants
        $typesVehicules = TypeVehicule::all(); // récupère tous les types
        $marques = Marque::all(); // récupère tous les marque de vehicules

        return Inertia::render('Vehicules/Edit', [
            'Vehicule' => $Vehicule,
            'carburants' => $carburants,
            'typesVehicules' => $typesVehicules,
            'marques' => $marques,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Vehicule $vehicule)
    {
        $data = $request->validate([
            'immatriculation' => 'required|string|max:255',
            'marque_id' => 'required|exists:marques,id',
            'model' => 'required|string|max:255',
            'typeVehicule_id' => 'required|exists:type_vehicules,id',
            'couleur' => 'required|string|max:100',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'carburant_id' => 'required|exists:carburants,id',
            'numSerie' => 'nullable|string|max:255',
            'anneeFabrication' => 'nullable|integer|min:1900|max:' . date('Y'),
            'dateAcquisition' => 'nullable|date',
        ]);

        // Gestion du fichier photo
        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($vehicule->photo && Storage::disk('public')->exists($vehicule->photo)) {
                Storage::disk('public')->delete($vehicule->photo);
            }
            $photoPath = $request->file('photo')->store('photos_voitures', 'public');
            $data['photo'] = $photoPath;
        } else {
            // Si aucune nouvelle photo n'est envoyée, on ne modifie pas la photo existante
            unset($data['photo']);
        }

        $vehicule->update($data);

        return redirect()->route('vehicules.index')->with('message', 'Véhicule mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicule $vehicule)
    {
        $vehicule->delete();
        return redirect()->route('vehicules.index')->with('message', 'vehicule supprimé avec succès.');
    }
}
