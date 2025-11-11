<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entretien;
use App\Models\Vehicule;
use App\Models\Fournisseur;
use App\Models\Piece;
use App\Models\Assurance;
use App\Models\Marque;
use App\Models\Intervention;
use App\Models\User;
use App\Models\Frais;
use App\Models\EntretienValidated;
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
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'probleme' => 'nullable|string',
            'description' => 'nullable|string',
            'prochaine_visite' => 'nullable|date',
            'mecanicien_id' => 'nullable|exists:users,id',
        ]);

        $validated['user_id'] = Auth::id();
        // dd($validated);
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
        $entretienValidated = EntretienValidated::all();
        return Inertia::render('Entretiens/Show', [
            'entretien' => $entretien,
            'vehicule' => $vehicule,
            'user' => $user,
            'fournisseur' => $fournisseur,
            'userConnecter' => $userConnecter,
            'pieces' => $pieces,
            'intervention' => $intervention,
            'entretienValidated' => $entretienValidated,
        ]);
    }

    public function validate(Request $request, Entretien $entretien)
    {
        $data = $request->validate([
            // entretien
            'statut' => 'required|in:Validé,Refusé',
            'type' => 'required|in:Préventif,Correctif,Légal',
            'mecanicien_id' => 'required|exists:users,id',
            'prochaine_visite' => 'required|date',
        ]);

        $date = Carbon::parse($data['prochaine_visite']);
        $start = $date->copy()->subHours(2);
        $end   = $date->copy()->addHours(2);
        $entretienValidated = EntretienValidated::where('user_id', $entretien->user_id)->first();

        // dd($entretien->user_id,$entretienValidated->user_id);
        // Vérifier si ce n’est PAS le même utilisateur que celui qui a fait la demande initiale
        if ($entretienValidated !== null && $entretienValidated->entretien_id !== null) {
            if ($entretien->id !== $entretienValidated->entretien_id) {

                $exists = Entretien::where('mecanicien_id', $data['mecanicien_id'])
                    ->whereBetween('prochaine_visite', [$start, $end])
                    ->where('id', '!=', $entretien->id)
                    ->exists();

                if ($exists) {
                    return back()->withErrors([
                        'mecanicien_id' => 'Ce mécanicien a déjà un entretien prévu dans les 2 heures autour de cette date.'
                    ]);
                }
            }
        }



        // ✅ Mise à jour de l’entretien
        $entretien->update($data);

        $dataValide['user_id'] = $entretien->user_id;
        $dataValide['entretien_id'] = $entretien->id;
        $dataValide['vehicule_id'] = $entretien->vehicule_id;
        $dataValide['mecanicien_id'] = $entretien->mecanicien_id;
        $dataValide['Type_entretien'] = $entretien->type;
        $dataValide['date_prevue'] = $entretien->prochaine_visite;
        // dd($dataValide);
        $EntretienValidated = EntretienValidated::create($dataValide);

        // notifier le demandeur
        if ($entretien->vehicule && $entretien->vehicule->user) {
            $entretien->vehicule->user->notify(new EntretienDemandeNotification($entretien));
        }

        // notifier le mécanicien
        $mecanicien = User::find($data['mecanicien_id']);
        if ($mecanicien) {
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
    public function checkDate()
    {
        $now = now(); // Date + heure actuelles

        // ✅ Récupère tous les entretiens
        $entretiens = Entretien::all();

        // ✅ Tableau pour stocker les résultats
        $resultats = [];

        foreach ($entretiens as $entretien) {
            // Ignorer si pas de date
            if (!$entretien->prochaine_visite) {
                $resultats[] = [
                    'entretien_id' => $entretien->id,
                    'statut' => 'Non défini',
                    'date' => null,
                ];
                continue;
            }

            try {
                // ✅ Convertit la date selon ton format (d/m/Y H:i ou Y-m-d H:i:s)
                $prochaineVisite = Carbon::parse($entretien->prochaine_visite);
            } catch (\Exception $e) {
                // En cas de format incorrect
                $resultats[] = [
                    'entretien_id' => $entretien->id,
                    'statut' => 'Format de date invalide',
                    'date' => $entretien->prochaine_visite,
                ];
                continue;
            }

            // ✅ Détermine le statut
            if ($prochaineVisite->isBefore($now)) {
                if ($entretien->statut === "Terminé") {
                    // Déjà terminé → on met juste la date de dernière visite
                    $entretien->dernier_visite = $prochaineVisite->format('Y-m-d H:i:s');
                    $entretien->save();
                    $statut = "Terminé";
                }
            }

            // ✅ Ajoute au tableau de retour
            $resultats[] = [
                'entretien_id' => $entretien->id,
                'statut' => $entretien->statut,
                'date' => $prochaineVisite->format('d/m/Y H:i'),
            ];
        }

        // ✅ Retourne tous les résultats
        return response()->json([
            'message' => 'Vérification des dates terminée.',
            'resultats' => $resultats
        ]);
    }

    public function getEntretiensValides()
    {
        // Récupère uniquement les entretiens validés
        $entretiensValides = Entretien::where('statut', 'validé')->get();

        return response()->json($entretiensValides);
    }

    public function statistiquesEntretien()
    {
        $user = auth()->user();

        // Récupérer tous les véhicules de l'utilisateur
        $vehicules = Vehicule::where('user_id', $user->id)->get();

        // Récupérer tous les entretiens de l'utilisateur
        $entretiens = Entretien::where('user_id', $user->id)->get();

        // Récupérer toutes les assurances de l'utilisateur (si nécessaire)
        $assurances = Assurance::where('user_id', $user->id)->get();

        // Récupérer toutes les marques (pour enrichir les véhicules)
        $marques = Marque::all();

        // Construire les données pour le graphe
        $stats = $vehicules->map(function ($v) use ($entretiens) {
            return [
                'nom' => $v->immatriculation,
                'entretiens' => $entretiens->where('vehicule_id', $v->id)->where('statut', 'validé')->count(),
            ];
        })->toArray();

        return Inertia::render('Dashboard', [
            'vehicules' => $vehicules,
            'entretiens' => $entretiens,
            'assurances' => $assurances,
            'marques' => $marques,
            'userConnecter' => $user,
            'stats' => $stats,
        ]);
    }
}
