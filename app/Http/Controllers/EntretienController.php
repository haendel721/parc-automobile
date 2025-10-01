<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entretien;
use App\Models\Vehicule;
use App\Models\Fournisseur;
use App\Models\User;
use App\Notifications\EntretienDemandeNotification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class EntretienController extends Controller
{
    // 📌 Liste des entretiens
    public function index()
    {
        $user = auth()->user();

        // Si admin → toutes les entretien
        $entretiens = $user->role === 'admin'
            ? Entretien::with(['user', 'fournisseur', 'vehicule'])->get()
            : Entretien::with('fournisseur', 'vehicule')->where('user_id', $user->id)->get();

        return Inertia::render('Entretiens/Index', [
            'entretiens' => $entretiens,
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
            'flash' => session('message') ? ['message' => session('message')] : [],
        ]);
    }

    // 📌 Formulaire création
    public function create()
    {
        $user = auth::user();

        $vehicules = $user->role === 'admin'
            ? Vehicule::all()
            : Vehicule::where('user_id', $user->id)->get();

        $fournisseurs = Fournisseur::all();

        return Inertia::render('Entretiens/Create', [
            'vehicules' => $vehicules,
            'fournisseurs' => $fournisseurs,
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
        ]);
    }

    // 📌 Enregistrer un nouvel entretien
    public function store(Request $request)
    {
        $role = Auth::user()->role;
        $role === 'admin' ? $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'type' => 'required|string|max:255',
            'dernier_visite' => 'nullable|date',
            'cout' => 'nullable|integer',
            'piece_remplacee' => 'nullable|string',
            'probleme' => 'nullable|string',
            'recommandation' => 'nullable|string',
            'prochaine_visite' => 'nullable|date',
            'description' => 'nullable|string',
            'derniere_vidange' => 'nullable|date',
        ]) : $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'probleme' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        $entretien = Entretien::create($validated);

        // notifier tous les admins
        $admins = User::where('role', 'admin')->get();

        // Méthode 1 : boucle (lisible)
        foreach ($admins as $admin) {
            $admin->notify(new EntretienDemandeNotification($entretien));
        }

        // Méthode 2 (alternative) : Notification facade
        // \Illuminate\Support\Facades\Notification::send($admins, new EntretienDemandeNotification($entretien));




        return redirect()->route('entretiens.index')->with('success', 'Entretien ajouté avec succès.');
    }

    // 📌 Afficher un entretien
    public function show(Entretien $entretien)
    {
        return Inertia::render('Entretiens/Show', [
            'entretien' =>$entretien ,
        ]);
    }

    // 📌 Formulaire modification
    public function edit(Entretien $entretien)
    {
        $vehicules = Vehicule::all();
        $fournisseurs = Fournisseur::all();
        return Inertia::render('Entretiens/Edit', compact('entretien', 'vehicules', 'fournisseurs'));
    }

    // 📌 Enregistrer la modification
    public function update(Request $request, Entretien $entretien)
    {
        $role = Auth::user()->role;
        $role === 'admin' ? $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'type' => 'required|string|max:255',
            'dernier_visite' => 'nullable|date',
            'cout' => 'nullable|integer',
            'piece_remplacee' => 'nullable|string',
            'probleme' => 'nullable|string',
            'recommandation' => 'nullable|string',
            'prochaine_visite' => 'nullable|date',
            'description' => 'nullable|string',
            'derniere_vidange' => 'nullable|date',
        ]) : $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'probleme' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $entretien->update($validated);

        return redirect()->route('entretiens.index')->with('success', 'Entretien modifié avec succès.');
    }

    // 📌 Supprimer un entretien
    public function destroy(Entretien $entretien)
    {
        $entretien->delete();
        return redirect()->route('entretiens.index')->with('success', 'Entretien supprimé avec succès.');
    }
}
