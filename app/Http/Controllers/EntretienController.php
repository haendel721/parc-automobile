<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entretien;
use App\Models\Vehicule;
use App\Models\Fournisseur;
use App\Models\Piece;
use App\Models\Intervention;
use App\Models\User;
use App\Models\Frais;
use App\Notifications\EntretienDemandeNotification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EntretienController extends Controller
{
    // 📌 Liste des entretiens
    public function index()
    {
        $user = auth()->user();

        // Si l'utilisateur est admin, il voit tout
        if ($user->role === 'admin') {
            $entretiens = Entretien::with(['vehicule', 'fournisseur', 'user'])->get();
        }
        // Si l'utilisateur est mécanicien, il ne voit que ses entretiens attribués
        elseif ($user->role === 'mecanicien') {
            $entretiens = Entretien::with(['vehicule', 'fournisseur', 'user'])
                ->where('mecanicien_id', $user->id)
                ->get();
        }
        // Si c’est un simple utilisateur (conducteur par ex.), il ne voit que ceux qu’il a demandés
        else {
            $entretiens = Entretien::with(['vehicule', 'fournisseur', 'user'])
                ->where('user_id', $user->id)
                ->get();
        }

        $T_user = User::all();
        $frais = Frais::all();
        $pieces = Piece::all();

        return inertia('Entretiens/Index', [
            'entretiens' => $entretiens,
            'user' => $user,
            'T_user' => $T_user,
            'frais' => $frais,
            'pieces' => $pieces,
            'flash' => [
                'message' => session('message'),
            ],
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
        // $role === 'admin' ? $validated = $request->validate([
        //     'vehicule_id' => 'required|exists:vehicules,id',
        //     'fournisseur_id' => 'nullable|exists:fournisseurs,id',
        //     'type' => 'required|string|max:255',
        //     'dernier_visite' => 'nullable|date',
        //     'cout' => 'nullable|integer',
        //     'piece_remplacee' => 'nullable|string',
        //     'probleme' => 'nullable|string',
        //     'recommandation' => 'nullable|string',
        //     'prochaine_visite' => 'nullable|date',
        //     'description' => 'nullable|string',
        //     'derniere_vidange' => 'nullable|date',
        // ]) : $validated = $request->validate([
        //     'vehicule_id' => 'required|exists:vehicules,id',
        //     'probleme' => 'nullable|string',
        //     'description' => 'nullable|string',
        //     'prochaine_visite' => 'nullable|date',
        // ]);
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'probleme' => 'nullable|string',
            'description' => 'nullable|string',
            'prochaine_visite' => 'nullable|date',
            'mecanicien_id' => 'nullable|exists:users,id',
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
        $vehicule = Vehicule::all();
        $user = User::all();
        $userConnecter = Auth::user()->role;
        $fournisseur = Fournisseur::all();
        $pieces = Piece::all();
        $intervention = Intervention::all();
        return Inertia::render('Entretiens/Show', [
            'entretien' => $entretien,
            'vehicule' => $vehicule,
            'user' => $user,
            'fournisseur' => $fournisseur,
            'userConnecter' => $userConnecter,
            'pieces' => $pieces,
            'intervention' => $intervention,
        ]);
    }
    // validation des entretiens
    // public function validate(Request $request, Entretien $entretien)
    // {
    //     // $id = $entretien->id;
    //     $data = $request->validate([
    //         'statut' => 'required|in:Validé,Refusé',
    //         'type' => 'required|in:Préventif,Correctif,Légal',
    //         'fournisseur_id' => 'required|exists:fournisseurs,id',
    //         'prochaine_visite' => 'required|date',
    //     ]);


    //     // dd($data);
    //     $entretien->update($data);

    //     return redirect()->route('entretiens.show', $entretien->id)
    //         ->with('success', 'Entretien mis à jour avec succès.');
    // }

    public function validate(Request $request, Entretien $entretien)
    {
        $data = $request->validate([
            'statut' => 'required|in:Validé,Refusé',
            'type' => 'required|in:Préventif,Correctif,Légal',
            'mecanicien_id' => 'required|exists:users,id',
            'prochaine_visite' => 'required|date',
        ]);
        $date = Carbon::parse($data['prochaine_visite']);

        // ⚡ Définir l'intervalle de 2h avant et 2h après
        $start = $date->copy()->subHours(2);
        $end   = $date->copy()->addHours(2);

        // Vérification si le fournisseur a déjà un entretien dans l'intervalle
        $exists = Entretien::where('mecanicien_id', $data['mecanicien_id'])
            ->whereBetween('prochaine_visite', [$start, $end])
            ->where('id', '!=', $entretien->id) // exclut l'entretien actuel
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'mecanicien_id' => 'Ce mecanicien a déjà un entretien prévu dans les 2 heures autour de cette date.'
            ]);
        }
        // dd($data);
        $entretien->update($data);
        // notifier le demandeur
        $utilisateurs = User::where('role', 'utilisateur')->get();
        foreach ($utilisateurs as $utilisateur) {
            $utilisateur->notify(new EntretienDemandeNotification($entretien));
        }
        // notifier le mécanicien
        $mecanicier = User::where('id', $data['mecanicien_id'])->get();
        foreach ($mecanicier as $mecanicien) {
            $mecanicien->notify(new EntretienDemandeNotification($entretien));
        }
        return redirect()->route('entretiens.show', $entretien->id)
            ->with('success', 'Entretien mis à jour avec succès.');
    }


    // 📌 Formulaire modification
    public function edit(Entretien $entretien)
    {
        $vehicules = Vehicule::all();
        $fournisseurs = Fournisseur::all();
        $userConnecter = Auth::user()->role;
        return Inertia::render('Entretiens/Edit', compact('entretien', 'vehicules', 'fournisseurs', 'userConnecter'));
    }

    // 📌 Enregistrer la modification
    public function update(Request $request, Entretien $entretien)
    {
        $role = Auth::user()->role;
        // $role === 'admin' ? $validated = $request->validate([
        //     'vehicule_id' => 'required|exists:vehicules,id',
        //     'fournisseur_id' => 'nullable|exists:fournisseurs,id',
        //     'type' => 'required|string|max:255',
        //     'dernier_visite' => 'nullable|date',
        //     'cout' => 'nullable|integer',
        //     'piece_remplacee' => 'nullable|string',
        //     'probleme' => 'nullable|string',
        //     'recommandation' => 'nullable|string',
        //     'prochaine_visite' => 'nullable|date',
        //     'description' => 'nullable|string',
        //     'derniere_vidange' => 'nullable|date',
        // ]) : $validated = $request->validate([
        //     'vehicule_id' => 'required|exists:vehicules,id',
        //     'probleme' => 'nullable|string',
        //     'description' => 'nullable|string',
        //     'prochaine_visite' => 'nullable|date',
        // ]);
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'probleme' => 'nullable|string',
            'description' => 'nullable|string',
            'prochaine_visite' => 'nullable|date',
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
    public function checkDate(Entretien $entretien)
    {
        $now = now(); // date + heure actuelle

        if ($entretien->prochaine_visite->isBefore($now)) {
            $statut = "En retard";
        } elseif ($entretien->prochaine_visite->isSameDay($now)) {
            $statut = "Aujourd'hui";
        } else {
            $statut = "À venir";
        }

        return response()->json([
            'entretien_id' => $entretien->id,
            'statut' => $statut,
            'date' => $entretien->prochaine_visite->format('d/m/Y H:i'),
        ]);
    }
    public function getEntretiensValides()
    {
        // Récupère uniquement les entretiens validés
        $entretiensValides = Entretien::where('statut', 'validé')->get();

        return response()->json($entretiensValides);
    }
}
