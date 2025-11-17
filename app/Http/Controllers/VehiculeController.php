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
use App\Notifications\EntretienKilometrageNotification;
use App\Models\Kilometrage;

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
            'entretien' => $entretien,
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
            'couleur' => 'nullable|string|max:100',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'carburant_id' => 'required|exists:carburants,id',
            'numSerie' => 'nullable|string|max:255',
            'anneeFabrication' => 'nullable|integer|min:1900|max:' . date('Y'),
            'dateAcquisition' => 'nullable|date',
            'kilometrique' => 'nullable|integer|min:0',
            'capacite_reservoir' => 'required|integer|min:0',
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
    public function show(Vehicule $vehicule)
    {
        // Récupérer le rôle de l'utilisateur connecté
        $userConnecter = Auth::user()->role;
        // Charger la relation assurance pour ce véhicule uniquement
        $vehicule->load('assurance');
        $user = Auth()->user();
        $carburants = Carburant::all(); 
        $typesVehicules = TypeVehicule::all(); 
        $marques = Marque::all(); 
         $dernierReleve = Kilometrage::with('user')
        ->where('vehicule_id', $vehicule->id)
        ->orderBy('date_releve', 'desc')
        ->orderBy('created_at', 'desc')
        ->first();

        // $vehicules = Vehicule::with(['kilometrages', 'interventions'])->findOrFail($vehicule->id);
        // Appel de la fonction du modèle
        // $kilometrage_total = $vehicules->calculerEtMettreAJourKilometrage();
        return Inertia::render('Vehicules/Show', [
            'vehicule' => $vehicule,        // un seul véhicule
            'assurance' => $vehicule->assurance, // assurance associée
            'userConnecter' => $userConnecter,
            'carburants' => $carburants,
            'user' => $user,
            'typesVehicules' => $typesVehicules,
            'marques' => $marques,
            'dernierReleve' => $dernierReleve,
            // 'kilometrage_total' => $kilometrage_total,
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
        $userConnecter = Auth::user()->role;
        return Inertia::render('Vehicules/Edit', [
            'Vehicule' => $Vehicule,
            'carburants' => $carburants,
            'typesVehicules' => $typesVehicules,
            'marques' => $marques,
            'userConnecter' => $userConnecter,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */



    public function update(Request $request, Vehicule $vehicule)
    {
        // ✅ Validation des champs
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
            'kilometrique' => 'required|integer|min:0',
            'capacite_reservoir' => 'nullable|integer|min:0',
        ]);

        // ✅ Gestion du fichier photo
        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($vehicule->photo && Storage::disk('public')->exists($vehicule->photo)) {
                Storage::disk('public')->delete($vehicule->photo);
            }

            // Sauvegarde de la nouvelle photo
            $photoPath = $request->file('photo')->store('photos_voitures', 'public');
            $data['photo'] = $photoPath;
        } else {
            // Si aucune nouvelle photo n'est envoyée, ne pas modifier la photo existante
            unset($data['photo']);
        }
        
        // ✅ Mise à jour des données du véhicule
        $vehicule->update($data);
        // ✅ Vérification du kilométrage pour déclencher une notification
        if ($vehicule->kilometrique >= 5000) {
            // Récupération de l'utilisateur propriétaire (assure-toi que la relation user() existe dans ton modèle Vehicule)
            $user = $vehicule->user;

            // Vérification pour éviter les doublons (par exemple, si la notification a déjà été envoyée)
            $dejaNotif = $user->notifications()
                ->where('data->vehicule_id', $vehicule->id)
                ->where('data->type', 'kilometrage')
                ->exists();

            if (!$dejaNotif) {
                $user->notify(new EntretienKilometrageNotification($vehicule));
            }
        }

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
