<?php

namespace App\Http\Controllers;

use App\Models\Entretien;
use App\Models\Piece;
use App\Models\Fournisseur;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PieceController extends Controller
{
    /**
     * Display a listing of the pieces.
     */
    public function index()
    {
        $user = auth()->user();

        // Si admin → toutes les pièces
        $pieces = Piece::with(['user', 'fournisseur'])->get();

        return Inertia::render('Pieces/Index', [
            'pieces' => $pieces,
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
            'flash' => session('message') ? ['message' => session('message')] : [],
        ]);
    }
    // Vérifie si la pièce existe déjà
    public function check(Request $request)
    {
        $nom = $request->get('nom');
        $exists = Piece::where('nom', 'like', $nom)->exists();

        return response()->json(['exists' => $exists]);
    }

    /**
     * Show the form for creating a new piece.
     */
    public function create(Request $request)
    {
        // Récupération des query parameters
        $entretien_id = $request->query('entretien_id');
        $vehicule_id = $request->query('vehicule_id');
        // Récupérer les pièces liées à cet entretien et ce véhicule
        $pieces = Piece::where('entretien_id', $entretien_id)
            ->where('vehicule_id', $vehicule_id)
            ->orderBy('created_at', 'desc')
            ->get();
        // Retourner ces données à Inertia
        return Inertia::render('Pieces/Create', [
            'fournisseurs' => Fournisseur::all(),
            'entretien_id' => $entretien_id,
            'vehicule_id' => $vehicule_id,
            'pieces' => $pieces,
        ]);
    }


    /**
     * Store a newly created piece in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prix' => 'required|numeric',
            'quantite' => 'required|integer|min:0',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'entretien_id' => 'nullable|exists:entretiens,id',
            'vehicule_id' => 'nullable|exists:vehicules,id',
        ]);
        $validated['user_id'] = Auth::id();
        // dd($validated);
        Piece::create($validated);

        // On redirige vers la même page avec les mêmes paramètres
        return redirect()->route('pieces.create', [
            'entretien_id' => $request->entretien_id,
            'vehicule_id' => $request->vehicule_id,
        ])->with('message', 'Pièce ajoutée avec succès.');
    }

    /**
     * Show the form for editing the specified piece.
     */
    public function edit(Piece $piece)
    {
        $fournisseurs = Fournisseur::all();

        return Inertia::render('Pieces/Edit', [
            'piece' => $piece,
            'fournisseurs' => $fournisseurs
        ]);
    }

    /**
     * Update the specified piece in storage.
     */
    public function update(Request $request, Piece $piece)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            // 'reference' => 'required|string|max:255|unique:pieces,reference,' . $piece->id,
            'prix' => 'required|numeric',
            'quantite' => 'required|integer|min:0',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
        ]);
        $validated['user_id'] = Auth::id();
        $piece->update($validated);

        return redirect()->route('pieces.index')
            ->with('message', 'Pièce mise à jour avec succès.');
    }

    /**
     * Remove the specified piece from storage.
     */
    public function destroy(Piece $piece)
    {
        $piece->delete();

        return redirect()->route('pieces.index')
            ->with('message', 'Pièce supprimée avec succès.');
    }
}
