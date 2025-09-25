<?php

namespace App\Http\Controllers;

use App\Models\Piece;
use App\Models\Fournisseur;
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
        $pieces = $user->role === 'admin'
            ? Piece::with(['user','fournisseur'])->get()
            : Piece::with('fournisseur')->where('user_id', $user->id)->get();

        return Inertia::render('Pieces/Index', [
            'pieces' => $pieces,
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
            'flash' => session('message') ? ['message' => session('message')] : [],
        ]);
    }


    /**
     * Show the form for creating a new piece.
     */
    public function create()
    {
        $fournisseurs = Fournisseur::all();

        return Inertia::render('Pieces/Create', [
            'fournisseurs' => $fournisseurs
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
        ]);
        $validated['user_id'] = Auth::id();
        Piece::create($validated);

        return redirect()->route('pieces.index')
            ->with('message', 'Pièce créée avec succès.');
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
