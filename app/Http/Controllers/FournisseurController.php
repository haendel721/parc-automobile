<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FournisseurController extends Controller
{
    public function index()
    {
        $fournisseurs = Fournisseur::all();

        return Inertia::render('Fournisseurs/Index', [
            'fournisseurs' => $fournisseurs
        ]);
    }

    public function create()
    {
        return Inertia::render('Fournisseurs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'addresse' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:fournisseurs,email',
            'siteWeb' => 'nullable|string|max:255',
        ]);
// dd($validated);
        Fournisseur::create($validated);

        return redirect()->route('fournisseurs.index')
                         ->with('message', 'Fournisseur créé avec succès.');
    }

    public function edit(Fournisseur $fournisseur)
    {
        return Inertia::render('Fournisseurs/Edit', [
            'fournisseur' => $fournisseur
        ]);
    }

    public function update(Request $request, Fournisseur $fournisseur)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'addresse' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:fournisseurs,email,' . $fournisseur->id,
            'siteWeb' => 'nullable|string|max:255',
        ]);

        $fournisseur->update($validated);

        return redirect()->route('fournisseurs.index')
                         ->with('message', 'Fournisseur mis à jour avec succès.');
    }

    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();

        return redirect()->route('fournisseurs.index')
                         ->with('message', 'Fournisseur supprimé avec succès.');
    }
}
