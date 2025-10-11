<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Intervention;
use App\Models\Entretien;
use App\Models\Piece;
use App\Models\Frais;
use Illuminate\Support\Facades\Auth;

class InterventionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $role = Auth::user()->role;
        $validated = $request->validate([
            'main_oeuvre' => 'required|numeric|min:0',
            'entretien_id' => 'required|exists:entretiens,id',
            'vehicule_id' => 'required|exists:vehicules,id',
            'kilometrage' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'duree_immobilisation' => 'nullable|integer|min:0',

        ]);
        $entretien = Entretien::find($validated['entretien_id']);
        if ($entretien) {
            $entretien->statut = 'Terminé';
            $entretien->save();
        }
        $validated['user_id'] = Auth::id();
        // dd( $validated);
        $intervention = Intervention::create($validated);
        // 🔹 Calculer et enregistrer automatiquement le frais
        $this->enregistrerFraisEntretien($intervention);
        return redirect()->route('entretiens.index')->with('message', 'Intervention enregistrée et frais d’entretien ajouté avec succès.');
    }
    public function enregistrerFraisEntretien(Intervention $intervention)
    {
        $user_id = Auth::id();

        // 🔹 Calcul de la somme des pièces
        $sommePieces = Piece::where('entretien_id', $intervention->entretien_id)
            ->where('vehicule_id', $intervention->vehicule_id)
            ->where('user_id', $user_id)
            ->selectRaw('COALESCE(SUM(prix * quantite), 0) as total')
            ->value('total');

        // 🔹 Calcul du total global
        $total = ($intervention->main_oeuvre ?? 0) + $sommePieces;

        // 🔹 Création ou mise à jour du frais correspondant à cet entretien
        Frais::updateOrCreate(
            [
                'vehicule_id' => $intervention->vehicule_id,
                'entretien_id' => $intervention->entretien_id,
                'user_id' => $user_id,
                'type_frais' => 'Entretien', // type du frais
            ],
            [
                'montant' => $total,
            ]
        );

        return $total;
    }

    // public function calculerCoutTotal($entretien_id, $vehicule_id)
    // {
    //     // Récupération de l'utilisateur connecté
    //     $user_id = Auth::id();

    //     // 1️⃣ Calcul de la somme de tous les coûts des pièces pour cet entretien, véhicule et utilisateur
    //     $sommePieces = Piece::where('entretien_id', $entretien_id)
    //         ->where('vehicule_id', $vehicule_id)
    //         ->where('user_id', $user_id)
    //         ->selectRaw('SUM(prix * quantite) as total')
    //         ->value('total');

    //     // Si aucune pièce trouvée, la somme vaut 0
    //     $sommePieces = $sommePieces ?? 0;

    //     // 2️⃣ Récupération de l'intervention correspondante
    //     $intervention = Intervention::where('entretien_id', $entretien_id)
    //         ->where('vehicule_id', $vehicule_id)
    //         ->where('user_id', $user_id)
    //         ->first();

    //     if ($intervention) {
    //         // 3️⃣ Calcul du coût total (main d'œuvre + coût des pièces)
    //         $total = $intervention->main_oeuvre + $sommePieces;

    //         // 4️⃣ Mise à jour du champ 'cout_total' ou similaire
    //         $intervention->update([
    //             'cout_total' => $total,
    //         ]);

    //         return response()->json([
    //             'message' => 'Coût total mis à jour avec succès.',
    //             'cout_total' => $total,
    //             'details' => [
    //                 'main_oeuvre' => $intervention->main_oeuvre,
    //                 'pieces' => $sommePieces
    //             ]
    //         ]);
    //     } else {
    //         return response()->json([
    //             'message' => 'Aucune intervention trouvée pour ces paramètres.',
    //         ], 404);
    //     }
    // }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
